#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# -------------------------------------------
SERVER=https://vsp-cluster.fly.dev
APIKEY="$SIMWRAPPER_API_KEY"
# -------------------------------------------

# write job list out to curl.json
if ( ! timeout 1m bash -c "until curl -s -f -o jobs.json -H 'Authorization: $APIKEY' $SERVER/jobs/?status=1; do sleep 7; done" ); then
	echo "FAIL fetching jobs status"
	exit 1
fi

# if joblist is non-empty, call the python script to run the jobs
JOBSIZE=$(wc -c < jobs.json)
if [ $JOBSIZE -gt 5 ]; then
	APIKEY="$APIKEY" python3 ~/qsub-launcher.py
fi

