# SIMWRAPPER/SIMRUNNER qsub job launcher
# This reads the job list from jobs.json and goes through them,
# launching qsub if possible.

import os,sys,requests,json,subprocess
from enum import Enum

SERVER = 'https://vsp-cluster.fly.dev'
BASE_FOLDER = '/net/ils'

APIKEY = 'APIKEY' in os.environ and os.environ['APIKEY'] or 'nope'

STATUS = {
    'new': 0,
    'queued': 1,
    'preparing': 2,
    'launched': 3,
    'complete': 4,
    'cancelled': 5,
    'error': 6
}

def set_job_status(job_id, dest=None, status=0, qsub_id=None):
    headers = {"Authorization": APIKEY, "Content-Type": "application/json" }
    r = requests.put(
            f"{SERVER}/jobs/{job_id}", 
            headers=headers,
            data = json.dumps({"status":status, "folder":dest, "qsub_id":qsub_id})
    )
    print(r)


def get_file_list(job_id):
    required_files = []

    file_lookup = {}
    files = requests.get(f"{SERVER}/files/?job_id={job_id}", 
                headers = {"Authorization": APIKEY, "Content-Type": "application/json" }
            ).json() 
    for f in files:
        file_lookup[f["name"]] = f

    # make sure user supplied all required files
    errors = []
    for f in required_files:
        if f not in file_lookup:
            msg = f"Missing required file: {f}" 
            errors.append(msg)
            print(msg)
    if len(errors) > 0: 
        sys.exit(1)

    return file_lookup


def download_single_file(file_record, dest):
        filename = f"{dest}/{file_record['name']}"
        print(111, filename)
        url = f"{SERVER}/files/{file_record['id']}"
        with requests.get(url, headers = {"Authorization": APIKEY }, stream=True) as r:
            r.raise_for_status()
            with open(filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=32768): f.write(chunk)


def download_all_job_files(file_lookup, dest):
    print(112, file_lookup)
    for filename in file_lookup:
        print(f"Fetching {filename}")
        download_single_file(file_lookup[filename], dest)
    print('ALL FILES COPIED')


def qsub_launch(job, dest):
    command = job.get("script", None)
    if command == None: return (-1, "No script command")

    print('LAUNCHING', command)
    process = subprocess.run(
        ['qsub', command],
        cwd = dest,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )
    # scrape ID
    stdout = process.stdout.decode('utf-8')
    if 'has been submitted' in stdout:
        loc = stdout.find('Your job ')
        qsub_id = stdout[loc+9:].split()[0]
        return (qsub_id, stdout)
    # error
    return (-1, stdout)


def create_output_folder(job, attempt=None):
    owner = job["owner"] or "simrunner"
    job_id = job["id"]
    run = f'{job_id}' # f'{job_id:04}'
    project = job["project"]

    if project:
        dest = f"{BASE_FOLDER}/{project}/run-{run}"
    else:
        dest = f"{BASE_FOLDER}/{owner}/run-{run}"


    if attempt != None: dest = dest + f"-{attempt}"
    print('DESTINATION FOLDER:', dest)

    try:
        os.makedirs(dest)
    except:
        if attempt == 100: raise RuntimeError("Cannot create dest folder")
        attempt = attempt == None and 1 or attempt+1
        dest = create_output_folder(job, attempt)
    return dest

def handle_new_job(job):
    job_id = job["id"]
    print('Acknowledging job', job_id)

    # acknowledge that we are processing the job
    set_job_status(job_id, status=STATUS['preparing'])

    # get list of files for this job
    file_lookup = get_file_list(job_id)

    # create output folder
    dest = create_output_folder(job)
    print('CREATED:',dest)

    # download all files
    download_all_job_files(file_lookup, dest)

    # launch
    qsub_id, stdout = qsub_launch(job, dest)
    if not stdout.startswith('Your job '): dest += f' :: {stdout}'

    # set status
    if qsub_id == -1:
        set_job_status(job_id, dest=dest, status=STATUS['error'])
    else:
        set_job_status(job_id, dest=dest, status=STATUS['launched'], qsub_id=qsub_id)


def check_status_of_running_jobs():
    lookup_by_qstat = {}
    status_codes = {'p':3, 'r':3, 's':5, 'z':4} # pending, running, stopped, finished

    with open('running.json', 'r') as f:
        running = json.load(f)
        for job in running: lookup_by_qstat[job["qsub_id"]] = job["id"]

    # get completed jobs from qstat
    process = subprocess.run(
        f"qstat -s prsz -u {os.environ['USER']}",
        shell=True,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )
    qstat_output = process.stdout.decode('utf-8').split('\n')

    # quit if we got no useful results
    if len(qstat_output) <= 2: return

    # parse results
    qstat_output = qstat_output[2:]
    for job in qstat_output:
        fields = job.split()
        if len(fields) < 5: continue

        qstat_id = fields[0]
        qstat_status = fields[4]
        if qstat_id in lookup_by_qstat:
            status = status_codes.get(qstat_status) or 3 # weird code? Just say still running
            set_job_status(lookup_by_qstat[qstat_id], status=status)


def main():
    # status mode: check status of running jobs
    if len(sys.argv) == 2:
        check_status_of_running_jobs()
        sys.exit(0)

    # regular mode: check for new jobs
    with open('jobs.json', 'r') as f:
        jobs = json.load(f)
        for job in jobs:
            handle_new_job(job)


if __name__ == "__main__":
    main()

