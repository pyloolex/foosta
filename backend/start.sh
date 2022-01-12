# Create logs directory.
mkdir -p /var/log/foosta

# Rerun nginx so that foosta's conf takes effect.
nginx

# Run the main process of the docker container.
uwsgi uwsgi.ini
