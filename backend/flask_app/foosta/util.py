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


def make_event_key(date, event_number):
    return date + f':{event_number:02d}'


def translate_events(cursor):
    events = {}

    cursor.execute('SELECT * FROM "EventMeta"')
    metas = cursor.fetchall()
    for row in metas:
        events[row['date'], row['event_number']] = {
            'date': row['date'].strftime("%Y-%m-%d"),
            'event_number': row['event_number'],
            'event_type': row['event_type'],
            'teams': {},
        }

    cursor.execute('SELECT * FROM "EventResult"')
    results = cursor.fetchall()
    for row in results:
        events[row['date'], row['event_number']]['teams'][
            row['team']] = {
                'result': row['result'],
                'squad': [],
            }

    cursor.execute('SELECT * FROM "EventSquad"')
    squads = cursor.fetchall()
    for row in squads:
        events[row['date'], row['event_number']]['teams'][
            row['team']]['squad'].append(row['player'])

    return events
