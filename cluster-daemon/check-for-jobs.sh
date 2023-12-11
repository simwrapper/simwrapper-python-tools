#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

SERVER=https://simwrapper-api.fly.dev
APIKEY=billy-12345

# write job list out to curl.json
if ( ! timeout 1m bash -c "until curl -s -f -o jobs.json $SERVER/jobs/?status=1; do sleep 7; done" ); then
	echo "FAIL fetching jobs status"
	exit 1
fi

echo SUCCESS

# if joblist is non-empty, call the python script to run the jobs
JOBSIZE=$(wc -c < jobs.json)
if [ $JOBSIZE -gt 5 ]; then
	echo GOT SOME WORK TO DO
fi


