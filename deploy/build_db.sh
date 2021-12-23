#!/bin/bash

# You need to have docker and docker-compose installed before
# continuing!

set -ex


if [[ $(docker-compose -f db/docker-compose.yml images -q) ]]
then
    docker-compose -f db/docker-compose.yml stop
    docker-compose -f db/docker-compose.yml rm -f
fi
sudo docker-compose -f db/docker-compose.yml up -d
