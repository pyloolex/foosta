#!/bin/bash

set -ex


# Add new test event.
curl localhost/api/events -XPOST -H "Content-Type: application/json" --insecure -d @deploy/smoke_test.json
echo "OK"

python3 deploy/smoke_test.py
echo "OK"
