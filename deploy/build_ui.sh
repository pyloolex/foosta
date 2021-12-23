#!/bin/bash

# You need to have docker and docker-compose installed before
# continuing!

set -ex


if [[ $(docker container ls -a | grep foosta_ui) ]]
then
    docker container stop foosta_ui
    docker container rm foosta_ui
fi
docker build -t foosta_ui_img:latest ui/
docker run -p 7300:7350 -d --restart always --name=foosta_ui foosta_ui_img
