# Setting up database

## Install Docker and docker-compose
Guide - [/doc/install/docker_and_docker_compose.rst](/doc/install/docker_and_docker_compose.rst)



## Launch DB
All the necessary settings are in `/db/docker-compose.yml`.
It has inline comments so that every line looks clear.

You should just run `docker-compose` inside that directory.
```bash
    cd foosta/db
    docker-compose up -d
```

`-d` flag means running in detached mode. If this flag is not specified, the terminal will hang and show logs.

As a result, the container is launched and the database accepts connections on port `7100` (or whatever is specified in `docker-compose.yml` under "ports" section).



## Verification

The fastest verification is to get into the postgresql-cli:
```bash
    docker exec -ti foosta_db psql -U foostauser -d foostadb
```

You should be able to see existing tables:
```bash
    foostadb=# \d
```

Also, you can find a table schema:
```bash
    foostadb=# \d "EventMeta"
```



## Recreating container

If `docker-compose up -d` is executed again, all the data will be preserved and initialization scripts won't be run. If clean run is needed,
```bash
    docker-compose stop && docker-compose rm -f
```
should be used.



## Connecting to the DB through Python
### Install requirements
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

Install Python requirements to work with the DB locally.
```bash
    pip3 install -r db/test-requirements.txt
```

Now `manage_db.py` tool can be used.


### Uploading to the database
If you want to upload some data to the database, do:
```bash
    python3 manage_db.py --port=<DB port> load <file_name>
```

For example:
```bash
    python3 manage_db.py --port=7100 load 2021_february.json
```


### Dumping from the database to a file
If you want, on the contrary, save DB state to a file, do:
```bash
    python3 manage_db.py --port=<DB port> dump <file_name>
```

For example:
```bash
    python3 manage_db.py --port=7100 dump current_state.json
```


### Clearing the database
You can also clear all the entries in DB by doing:
```bash
    python3 manage_db.py --port=7100 clear
```


### Verification
If you can successfully load data to the DB and query it through
```bash
    docker exec -ti foosta_db psql -U foostauser -d foostadb
    foostadb=# SELECT * FROM "EventMeta";
```

, it could be concluded that the database is launched and works properly.
