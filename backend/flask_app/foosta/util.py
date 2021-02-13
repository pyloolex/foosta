# Foosta, 2021-present.

import psycopg2
from psycopg2 import extras


# NOTE: I'm not sure it's the most reliable approach.
# Need to find a better way of accessing machine localhost.
DOCKER_HOST_GATEWAY_IP = "172.17.0.1"


def connect_to_db():
    connection = psycopg2.connect(
        database="foostadb",
        user='foostauser',
        password='foostapassword',
        host=DOCKER_HOST_GATEWAY_IP,
        port=7100,
    )
    cursor = connection.cursor(cursor_factory=extras.RealDictCursor)

    return connection, cursor
