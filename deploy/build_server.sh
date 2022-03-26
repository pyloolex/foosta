#!/bin/bash

set -ex

# Install nginx.
sudo apt install -y nginx

# Copy nginx config making it listen to port 80.
sudo cp nginx_foosta_global.conf /etc/nginx/conf.d/

# Remove default nginx config from port 80.
if [[ -f /etc/nginx/sites-enabled/default ]]
then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Kill every process blocking port 80.
if [[ $(sudo lsof -t -i:80) ]]
then
    sudo lsof -t -i:80 | xargs sudo kill -9
fi

# Restart nginx.
sudo nginx
