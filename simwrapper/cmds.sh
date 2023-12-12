#/usr/bin/env bash

# URL=http://127.0.0.1:4999
URL=https://simwrapper-api.fly.dev

echo "-----1: CREATE JOB"

curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: billy-12345678" \
     -d '{"name": "billy"}' \
     $URL/jobs/


echo  "-----2: ADD FILES TO JOB"

curl -F file="@static/images/icon-atlas.png" \
     -F job_id=1 \
     $URL/files/

curl -F file="@static/images/SW_favicon.png" \
     -F job_id=1 \
     $URL/files/

curl -F file="@sites.py" \
     -F job_id=1 \
     $URL/files/

curl -F file="@run-test.sh" \
     -F job_id=2 \
     $URL/files/


# Set the run script "qsub" setting

curl -X PUT \
     -H "Content-Type: application/json" \
     -d '{"qsub": "run-test.sh"}' \
     $URL/jobs/2

echo  "-----3: QUEUE JOB BY UPDATING (PUT) ITS STATUS"

curl -X PUT \
     -H "Content-Type: application/json" \
     -d '{"status": "2" }' \
     $URL/jobs/1

