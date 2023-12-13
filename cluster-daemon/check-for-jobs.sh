#!/bin/bash -l
set -euo pipefail
IFS=$'\n\t'

# -------------------------------------------
SERVER=https://vsp-cluster.fly.dev
APIKEY="$SIMWRAPPER_API_KEY"
# -------------------------------------------

check_for_new_jobs() {
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
  if ( ! timeout 1m bash -c \
	  "until curl -s -f -o running.json -H 'Authorization: $APIKEY' $SERVER/jobs/?status=3; do sleep 7; done" ); \
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

if [ $# -eq 0 ]; then
    check_for_new_jobs
else
    check_for_running_jobs > /dev/null 2>&1
fi
exit 0

