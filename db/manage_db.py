import argparse
import json
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


def clear(connection, cursor):
    cursor.execute('DELETE FROM "EventMeta"')
    cursor.execute('DELETE FROM "EventResult"')
    cursor.execute('DELETE FROM "EventSquad"')
    connection.commit()


def dump(cursor, file_name):
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

    with open(file_name, 'w', encoding='UTF-8') as output_file:
        json.dump(
            sorted(events.values(),
                   key=lambda elem: (elem['date'], elem['event_number'])),
            output_file,
            indent=2,
        )


def load(connection, cursor, file_name):
    clear(connection, cursor)

    with open(file_name, encoding='UTF8') as input_file:
        events = json.load(input_file)

    event_results = []
    event_squads = []
    for payload in events:
        # Not sure but the performance might be better if all match
        # metas are collected in python object first and inserted into
        # DB at the very end as a single operation.
        for i, team_info in enumerate(payload['teams']):
            event_results.append(
                f"""('{payload["date"]}', {payload["event_number"]}, {i}, """
                f"""{team_info["result"]})"""
            )
            for player in team_info['squad']:
                event_squads.append(
                    f"""('{payload["date"]}', {payload["event_number"]}, """
                    f"""'{player}', {i})"""
                )

        cursor.execute(
            f"""INSERT INTO "EventMeta" """
            f"""(date, event_number, event_type) """
            f"""VALUES ('{payload["date"]}', {payload["event_number"]}, """
            f"""'{payload["event_type"]}')"""
        )

    cursor.execute(
        f"""INSERT INTO "EventResult" """
        f"""(date, event_number, team, result) """
        f"""VALUES {", ".join(event_results)};"""
    )
    cursor.execute(
        f"""INSERT INTO "EventSquad" """
        f"""(date, event_number, player, team) """
        f"""VALUES {', '.join(event_squads)};"""
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
            f'positional argument "file_name" is required in case of '
            f'"{args.operation}"'
        )

    return args.operation, args.file_name


def main():
    # TODO(ferc): Create tests for manage_db.py
    operation, file_name = parse_arguments()

    connection, cursor = connect_to_db()

    if operation == 'dump':
        dump(cursor, file_name)
    elif operation == 'load':
        load(connection, cursor, file_name)
    else:
        assert operation == 'clear'
        clear(connection, cursor)

    print("OK")


if __name__ == '__main__':
    main()
