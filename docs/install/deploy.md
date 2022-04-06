# Deploying an app in production

## Deploying containers

Update environment:
```bash
    sudo apt update && sudo apt -y upgrade
```

Check if there is a swap file:
```bash
    sudo swapon --show
```

If no, create one (works for ubuntu 20.04, maybe latest will work too):
```bash
    sudo fallocate -l 10G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

(More info about swap: https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04)

And add the following settings at the end of the `/etc/sysctl.conf`:
```
    vm.swappiness=10
    vm.vfs_cache_pressure=50
```

Install Docker and docker-compose: [/docs/install/docker_and_docker_compose.rst](/docs/install/docker_and_docker_compose.rst)

Remove everything untracked (in case you already did something locally). First, check what files could be cleaned up:
```bash
    git clean -xdfn
```
If it's okay, remove them:
```bash
    git clean -xdf
```

Create password files:
```bash
    echo '"s3e-db"' > db/shared/password_db.json
    cp db/shared/password_db.json backend/flask_app/foosta/password_db.json

    echo '"smoke-t2t"' > backend/flask_app/foosta/password_backend.json
```

Run `build_all.sh`:
```bash
    ./deploy/build_all.sh
```
