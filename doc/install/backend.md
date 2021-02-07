# Setting up a backend

## Deploying an app in a container
Navigate to `foosta/backend/` directory and build docker image:
```bash
    cd foosta/backend/
    docker build -t foosta_backend_img:latest .
```

The image is ready to start a container from:
```bash
    docker run -p 7200:7250 -d --restart always --name=foosta_backend foosta_backend_img
```
`-d` means "detached". You run the command and it continues to live in the background.

Now you can access "curl http://localhost:7200" from the Vagrant VM and
"curl http://172.28.128.4:7200" from the host.



## If you need to rebuild an image
1. Repeat the "build" command: `docker build -t foosta_backend_img:latest .`
2. Stop an existing container: `docker container stop foosta_backend`
3. Remove an existing container: `docker container rm foosta_backend`
4. Run new container again: `docker run -p 7200:7250 -d --restart always --name=foosta_backend foosta_backend_img`



## Development process [WIP]
TBD

Rebuilding an image is not a very fast process. During the development, it could make sense to run a container in an attached mode. Then you won't have to stop the container before removing and always use one command:
```bash
    docker build -t foosta_backend_img:latest . && docker container rm foosta_backend && docker run -p 7200:7250 --name=foosta_backend foosta_backend_img
```
