#/usr/bin/env bash

echo "-----1: CREATE JOB"

curl -X POST \
     -H "Content-Type: application/json" \
     -H "Authorization: billy-12345678" \
     -d '{"name": "billy"}' \
     http://127.0.0.1:5000/jobs/


echo  "-----2: ADD FILES TO JOB"

curl -F file="@static/images/icon-atlas.png" \
     -F job_id=1 \
     http://127.0.0.1:5000/files/

curl -F file="@static/images/SW_favicon.png" \
     -F job_id=1 \
     http://127.0.0.1:5000/files/

curl -F file="@sites.py" \
     -F job_id=1 \
     http://127.0.0.1:5000/files/


echo  "-----3: QUEUE JOB BY UPDATING (PUT) ITS STATUS"

curl -X PUT \
     -H "Content-Type: application/json" \
     -d '{"status": "1"}' \
     http://127.0.0.1:5000/jobs/1

