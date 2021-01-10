Setting up PostgreSQL in Docker
*******************************

Launching container
=======================

First, docker-compose.yml should be created. It's pretty small and easy
to understand. It has inline comments so that every line looks clear.

In order to launch docker container, the command

.. sourcecode:: text

    docker-compose up -d

should be executed.

``-d`` flag means running in detached mode. If this flag is not
specified, the terminal will hang and show logs.

As a result, the container is launched and the database accepts
connections on port ``7001`` (or whatever is specified in
docker-compose.yml under "ports" section).

This availability could be checked by the basic python script "test.py"
which uses psycopg2 library in order to connect to PostgreSQL DB.

Recreating container
====================
If ``docker-compose up -d`` is executed again, all the data will be
preserved and initialization scripts won't be run. If clean run is
needed,

.. sourcecode:: text

    docker-compose stop && docker-compose rm -f

should be used.

Debugging DB through psql
=========================
In order to get inside the container's ``psql``, run

.. sourcecode:: text

    docker exec -ti postgre_db_1 psql -U postgres

where databases could be modified.
