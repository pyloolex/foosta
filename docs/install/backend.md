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

Now you can access `curl http://localhost:7200` from the Vagrant VM and
`curl http://172.28.128.4:7200` from the host.



## If you need to rebuild an image
1. Repeat the "build" command: `docker build -t foosta_backend_img:latest .`
2. Stop an existing container: `docker container stop foosta_backend`
3. Remove an existing container: `docker container rm foosta_backend`
4. Run new container again: `docker run -p 7200:7250 -d --restart always --name=foosta_backend foosta_backend_img`



## Development process

### Container in an attached mode
Rebuilding an image is not a very fast process. During the development,
it could make sense to run a container in an attached mode.
Then you won't have to stop the container before removing and always
use one command:
```bash
    docker build -t foosta_backend_img:latest . && docker container rm foosta_backend && docker run -p 7200:7250 --name=foosta_backend foosta_backend_img
```



### Deploying locally
More efficient and more fast way is not to use a container and deploy the app locally.

Install all the requirements:
```bash
    sudo apt install -y python3-pip python3-dev libpq-dev
    pip3 install -r requirements.txt
```

Add foosta package to `PYTHONPATH`:
```bash
    export PYTHONPATH="${PYTHONPATH}:/vagrant/backend/flask_app/"
```

Now you can launch the development server:
```bash
    FLASK_DEBUG=1 python3 flask_app/foosta/app.py
```

It automatically refereshes with any code change. Unlike React app, the changes
on the host are visible in the vagrant VM, and you don't need to do `touch`.
The development server will be refreshed after code change on the host.



## Auto-tests [WIP]
### Prepare DB
In order to run tests, you need to install postgres locally:
```bash
    sudo apt install postgresql
```

And add tables:
```bash
    sudo -u postgres psql -af db/initdb_scripts/01-create-database.sql
    sudo -u postgres psql "host=localhost port=5432 dbname=foostadb user=foostauser password=foostapassword" -af db/initdb_scripts/02-create-tables.sql
```


### Run tests.
First of all, install python testing requirements:
```bash
    pip3 install -r backend/test-requirements.txt
```

Now you can run tests:
```bash
    pytest --disable-warnings backend
```