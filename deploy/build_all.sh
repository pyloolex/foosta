#!/bin/bash

# You need to have docker and docker-compose installed before
# continuing!

set -ex


# Build everything in parallel.
./deploy/build_db.sh | sed 's/^/DB: /' &
./deploy/build_backend.sh | sed 's/^/Backend: /' &
./deploy/build_ui.sh | sed 's/^/UI: /' &
./deploy/build_server.sh | sed 's/^/Server: /' &

wait
echo "Build is successful!"
