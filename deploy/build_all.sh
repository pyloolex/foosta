#!/bin/bash

# You need to have docker and docker-compose installed before
# continuing!

set -ex


./deploy/build_db.sh
./deploy/build_backend.sh
./deploy/build_ui.sh
./deploy/build_server.sh

echo "Build is successful!"
