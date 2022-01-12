#!/bin/bash

# You need to have docker and docker-compose installed before
# continuing!

set -ex

# First of all, check that the passwords are configured properly.
if [[ ! -f backend/flask_app/foosta/password_backend.json ]]
then
    echo "Backend password is required"
    exit 1
fi
if [[ ! -f backend/flask_app/foosta/password_db.json ]]
then
    echo "DB password is required"
    exit 1
fi


if [[ $(docker container ls -a | grep foosta_backend) ]]
then
    docker container stop foosta_backend
    docker container rm foosta_backend
fi
docker build -t foosta_backend_img:latest backend/
docker run -p 7200:7250 -d --restart always --name=foosta_backend foosta_backend_img
