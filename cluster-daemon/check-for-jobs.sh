#!/bin/bash -l
set -euo pipefail
IFS=$'\n\t'

# -------------------------------------------
SERVER=https://vsp-cluster.fly.dev
APIKEY="$SIMWRAPPER_API_KEY"
# -------------------------------------------

# HOW IT WORKS:
# 1. "check_for_jobs.sh" is run from cron every three minutes to ping the intermediate server
#    on the internet and see if any new jobs are in the queue
# 2. If it finds any new jobs in queue, it calls qsub-launcher.py which *writes* qsub-launch.sh which
#    runs the command via qsub.
# 3. "check_for_jobs status" is also run from cron every three minutes (but one minute later) and
#    and it calls the qsub status command to see if any jobs are running
# 4. If yes it posts the status, completed, error, etc to the intermediate server with statuses


# check if the list of running jobs has changed, and post anything new to simwrapper server
poll_running_jobs() {
  jobs=$(squeue --states=all --format "%g,%u,%i,%t,%m,%D,%C,%I,%J,%V,%S,%e,\"%o\"" | egrep "^(GROUP|ils)")

  if diff <(echo "$jobs") ~/squeue.txt >/dev/null; then
    echo "same" > /dev/null
  else
    echo "different" > /dev/null
    echo "$jobs" > ~/squeue.txt

    # post new list to simwrammer: ...
    echo "POSTING $APIKEY"
    curl -F "squeue=@squeue.txt" -H "Authorization: $APIKEY" $SERVER/squeue_jobs/
    echo 'DONE'
  fi
}


# update list of current jobs, and check for any new jobs from simwrapper
check_for_new_jobs() {

  poll_running_jobs

  # status=1: queued
  if ( ! timeout 1m bash -c \
	  "until curl -s -f -o jobs.json -H 'Authorization: $APIKEY' $SERVER/jobs/?status=1; do sleep 7; done" ); \
  then
     echo "FAIL fetching jobs status"
     exit 1
  fi

  # if joblist is non-empty, call the python script to run the jobs
  JOBSIZE=$(wc -c < jobs.json)
  if [ $JOBSIZE -gt 5 ]; then
    APIKEY="$APIKEY" python3 ~/qsub-launcher.py
  fi
}

check_for_running_jobs() {
  # status=4: running
  if ( ! timeout 1m bash -c \
	  "until curl -s -f -o running.json -H 'Authorization: $APIKEY' $SERVER/jobs/?running; do sleep 7; done" ); \
  then
     echo "FAIL fetching jobs status"
     exit 1
  fi

  # if joblist is non-empty, call the python script to run the jobs
  JOBSIZE=$(wc -c < running.json)
  if [ $JOBSIZE -gt 5 ]; then
     APIKEY="$APIKEY" python3 ~/qsub-launcher.py check_status
  fi
}

if   [ $# -eq 0 ]; then
    # check for newly queued jobs
    check_for_new_jobs
elif [ $# -eq 1 ]; then
    # get status of running jobs
    check_for_running_jobs > /dev/null 2>&1
else
    # silent mode
    check_for_new_jobs > /dev/null 2>&1
fi

exit 0

