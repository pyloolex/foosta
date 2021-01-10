# Setting up database

## Install Docker and docker-compose
Guide - [/doc/installation/docker_and_docker_compose.rst](/doc/installation/docker_and_docker_compose.rst)

## Launch DB
All the necessary settings are in `/db/docker-compose.yml`.
It has inline comments so that every line looks clear.

You should just run `docker-compose` inside that directory.
```bash
    cd foosta/db
    docker-compose up -d
```

`-d` flag means running in detached mode. If this flag is not specified, the terminal will hang and show logs.

As a result, the container is launched and the database accepts connections on port `7001` (or whatever is specified in `docker-compose.yml` under "ports" section).

## Verification

The fastest verification is to get into the postgresql-cli:
```bash
    docker exec -ti postgre_db_1 psql -U foostauser -d foostadb
```

You should be able to see data in `users` table:
```bash
    foostadb=# select * from users;
```

## Recreating container

If docker-compose up -d is executed again, all the data will be preserved and initialization scripts won't be run. If clean run is needed,
```bash
    docker-compose stop && docker-compose rm -f
```
should be used.

## Connecting to the DB through Python
Install `pip3`:
```bash
    sudo apt install python3-pip
```

Also, the `python3-dev` package is required for compilation of Python extensions written in C or C++, like `psycopg2`:
```bash
    sudo apt install python3-dev
```

And again, in order to install `psycopg2`, you need to install `libpq-dev` first.
```bash
    sudo apt install libpq-dev
```

Install `psycopg2` package for python through pip3.
```bash
    pip3 install psycopg2
```
This package is needed in order to connect to DB from python code.
