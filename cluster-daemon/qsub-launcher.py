# SIMWRAPPER/SIMRUNNER qsub job launcher
# This reads the job list from jobs.json and goes through them,
# launching qsub if possible.

import os,sys,requests,json,subprocess
from enum import Enum

SERVER = 'https://simwrapper-api.fly.dev'
BASE_FOLDER = '/net/ils'

APIKEY = 'APIKEY' in os.environ and os.environ['APIKEY'] or 'nope'
print(APIKEY)

STATUS = {
    'new': 0,
    'queued': 1,
    'preparing': 2,
    'launched': 3,
    'complete': 4,
    'cancelled': 5,
    'error': 6
}

def set_job_status(job_id, status):
    headers = {"Authorization": APIKEY, "Content-Type": "application/json" }
    r = requests.put(f"{SERVER}/jobs/{job_id}", data = json.dumps({"status": status}), headers=headers)
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


def qsub_launch(job, dest):
    command = job.get("qsub", None)
    if command == None: raise "No qsub command"

    print('LAUNCHING', command)
    process = subprocess.run(
        ['qsub', command],
        cwd = dest
    )
    return process.returncode


def handle_new_job(job):
    job_id = job["id"]
    print('Acknowledging job', job_id)


    # acknowledge that we are processing the job
    set_job_status(job_id, STATUS['preparing'])

    # get list of files for this job
    file_lookup = get_file_list(job_id)

    # create output folder
    owner = job["owner"] or "simrunner"
    run = f'{job_id:04}'
    dest = f"{BASE_FOLDER}/{owner}/run-{run}"
    print('DESTINATION FOLDER:', dest)
    os.makedirs(dest)
   
    # download all files
    download_all_job_files(file_lookup, dest)

    # launch
    return_code = qsub_launch(job, dest)
    print('launched with return code', return_code)

    # set status
    if return_code == 0:
        set_job_status(job_id, STATUS['launched'])
    else:
        set_job_status(job_id, STATUS['error'])

def main():
    with open('jobs.json', 'r') as f:
        jobs = json.load(f)
        for job in jobs:
            handle_new_job(job)


if __name__ == "__main__":
    main()

