# SIMWRAPPER/SIMRUNNER qsub job launcher
# This reads the job list from jobs.json and goes through them,
# launching qsub if possible.

import os,sys,requests,json,subprocess
from enum import Enum

SERVER = 'https://vsp-cluster.fly.dev'
BASE_FOLDER = '/net/ils'

APIKEY = 'APIKEY' in os.environ and os.environ['APIKEY'] or 'nope'

STATUS = {
    'draft': 0,
    'submitted': 1,
    'preparing': 2,
    'queued': 3,
    'running': 4,
    'complete': 5,
    'cancelled': 6,
    'error': 7
}

def set_job_status(job_id, dest=None, status=0, qsub_id=None, start=None):
    headers = {"Authorization": APIKEY, "Content-Type": "application/json" }
    r = requests.put(
            f"{SERVER}/jobs/{job_id}",
            headers=headers,
            data = json.dumps({"status":status, "folder":dest, "qsub_id":qsub_id, "start":start})
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
        url = f"{SERVER}/files/{file_record['id']}"
        with requests.get(url, headers = {"Authorization": APIKEY }, stream=True) as r:
            r.raise_for_status()
            with open(filename, 'wb') as f:
                for chunk in r.iter_content(chunk_size=32768): f.write(chunk)


def download_all_job_files(file_lookup, dest):
    for filename in file_lookup:
        print(f"Fetching {filename}")
        download_single_file(file_lookup[filename], dest)
    print('ALL FILES COPIED')


def build_qsub_command(job, dest):
    project = job.get("project","simrunner") or "simrunner"
    email = job.get("cEmail","")
    ram = job.get("cRAM", "1G") or "1G"
    processors = job.get("cProcessors","1") or "1"

    # is command an existing file? Read it
    try:
        with open(os.path.join(dest, job['script']),'r') as f:
            script = f.read()

    # otherwise command is a shell command
    except:
        script = job['script']


    preamble = f"""#!/bin/bash --login
#----------------------------
# TU COMPUTE CLUSTER SETTINGS
#----------------------------
#SBATCH --job-name={project}
#SBATCH --cpus-per-task={processors}
#SBATCH --mem={ram}
#SBATCH --mail-user={email}
#SBATCH --mail-type=BEGIN,END,FAIL
#SBATCH --output=simrunner.log
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --time=96:00:00
set -euo pipefail
umask 0007
#----------------------------

{script}

"""
    with open(os.path.join(dest, 'sbatch-launch.sh'),'w') as f:
        f.write(preamble)
    return

def qsub_launch(job, dest):
    command = job.get("script", None)
    if command == None: return (-1, "No script command")

    build_qsub_command(job,dest)

    print('LAUNCHING', command)
    process = subprocess.run(
        ['sbatch', 'sbatch-launch.sh'],
        cwd = dest,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT
        )
    # scrape ID
    stdout = process.stdout.decode('utf-8')
    if 'Submitted batch job' in stdout:
        lines = stdout.split('\n')
        qsub_id = lines[0][20:]
        print("funky: ",qsub_id)
        return (qsub_id, stdout)
    # error
    return (-1, stdout)


def create_output_folder(job, attempt=None):
    owner = job["owner"] or "simrunner"
    job_id = job["id"]
    run = f'{job_id}' # f'{job_id:04}'
    project = job["project"]

    print(1,project)
    if project:
        # Even if it starts with slash, it goes inside /net/ils
        if project.startswith(BASE_FOLDER): project = project[9:]
        print(2,project)
        project = f'{BASE_FOLDER}/{project}'
        print(3,project)
        dest = f"{project}/run-{run}"
        print(4,dest)
        dest = dest.replace('//','/')
        print(5,dest)
    else:
        dest = f"{BASE_FOLDER}/{owner}/run-{run}"
        print(6,dest)

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
    if not stdout.startswith('Submitted batch job'): dest += f' :: {stdout}'

    # set status
    if qsub_id == -1:
        set_job_status(job_id, dest=dest, status=STATUS['error'])
    else:
        set_job_status(job_id, dest=dest, status=STATUS['queued'], qsub_id=qsub_id)


def check_status_of_running_jobs():
    lookup_by_qstat = {}
    # qsub status codes are: pending, running, stopped, finished:
    status_codes = {'PD':STATUS['queued'], 'R':STATUS['running'], 'CA':STATUS['cancelled'],
                    'CD':STATUS['complete'], 'F':STATUS['error']}

    with open('running.json', 'r') as f:
        running = json.load(f)
        for job in running: lookup_by_qstat[job["qsub_id"]] = job["id"]

    # get jobs from qstat command
    process = subprocess.run(
        # f"qstat -s prsz -u {os.environ['USER']}",
        f'squeue --states=all --me --format "%.18i %.2t %S"',
        shell=True,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT
    )
    qstat_output = process.stdout.decode('utf-8').split('\n')

    # quit if we got no useful results
    if len(qstat_output) <= 1: return

    # parse results
    qstat_output = qstat_output[1:]
    for job in qstat_output:
        fields = job.split()
        if len(fields) < 2: continue

        qstat_id = fields[0]
        qstat_status = fields[1]
        if qstat_id in lookup_by_qstat:
            status = status_codes.get(qstat_status) or STATUS['running'] # weird code? Just say still running
            date = len(fields) >= 3 and f"{fields[2]}" or None
            if date: date = date[:10] + ' ' + date[11:]
            set_job_status(lookup_by_qstat[qstat_id], status=status, start=date)


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

