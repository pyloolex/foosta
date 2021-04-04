import argparse
import json
import sys
import psycopg2
from psycopg2 import extras


def connect_to_db():
    connection = psycopg2.connect(
        database="foostadb",
        user='foostauser',
        password='foostapassword',
        host="localhost",
        port=7100,
    )
    cursor = connection.cursor(cursor_factory=extras.RealDictCursor)

    return connection, cursor

def print_usernames(cursor):
    cursor.execute("select * from users")
    data = cursor.fetchall()
    names = [item['username'] for item in data]
    print(len(names), names)


def clear(connection, cursor):
    cursor.execute('DELETE FROM "EventMeta"')
    cursor.execute('DELETE FROM "EventResult"')
    cursor.execute('DELETE FROM "EventSquad"')
    connection.commit()


def dump(connection, cursor, file_name):
    cursor.execute('SELECT * FROM "EventMeta"')
    metas = cursor.fetchall()

    events = {}
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

    for event in events.values():
        event['teams'] = list(event['teams'].values())

    json.dump(
        sorted(events.values(),
               key=lambda elem: (elem['date'], elem['event_number'])),
        open(file_name, 'w'),
        indent=2,
    )


def load(connection, cursor, file_name):
    clear(connection, cursor)

    events = json.load(open(file_name))

    event_results = []
    event_squads = []
    for payload in events:
        # Not sure but the performance might be better if all match
        # metas are collected in python object first and inserted into
        # DB at the very end as a single operation.
        for i, team_info in enumerate(payload['teams']):
            event_results.append(
                "('{date}', {event_number}, {team}, {result})".format(
                    date=payload['date'],
                    event_number=payload['event_number'],
                    team=i,
                    result=team_info['result'],
                )
            )
            for player in team_info['squad']:
                event_squads.append(
                    "('{date}', {event_number}, '{player}', {team})".format(
                        date=payload['date'],
                        event_number=payload['event_number'],
                        player=player,
                        team=i,
                    )
                )

        cursor.execute(
            "insert into \"EventMeta\" "
            "(date, event_number, event_type) "
            "values ('{date}', {event_number}, '{event_type}')".format(
                date=payload['date'],
                event_number=payload['event_number'],
                event_type=payload['event_type'],
            )
        )
    cursor.execute(
        "INSERT INTO \"EventResult\" "
        "(date, event_number, team, result) "
        "VALUES {values};".format(
            values=', '.join(event_results),
        )
    )
    cursor.execute(
        "INSERT INTO \"EventSquad\" "
        "(date, event_number, player, team) "
        "VALUES {values};".format(
            values=', '.join(event_squads),
        )
    )

    connection.commit()


def parse_arguments():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument(
        'operation',
        choices=['load', 'dump', 'clear'],
        help="what operation should be performed with the DB",
    )
    arg_parser.add_argument(
        'file_name',
        nargs='?',
        help="json file to be loaded from/ dumped to",
    )
    args = arg_parser.parse_args()

    if args.operation == 'clear':
        return args.operation, None
    if args.file_name is None:
        arg_parser.error(
            'positional argument "file_name" is required in case of '
            '"{operation}"'.format(operation=args.operation)
        )

    return args.operation, args.file_name


def main():
    operation, file_name = parse_arguments()

    connection, cursor = connect_to_db()

    if operation == 'dump':
        dump(connection, cursor, file_name)
    elif operation == 'load':
        load(connection, cursor, file_name)
    else:
        assert operation == 'clear'
        clear(connection, cursor)

    print("OK")


if __name__ == '__main__':
    main()
