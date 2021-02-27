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


def dump(connection, cursor, file_name):
    cursor.execute("select * from \"MatchMeta\"")
    match_metas = cursor.fetchall()
    matches = {}
    for match in match_metas:
        matches[match['date'], match['match_number']] = {
            'date': match['date'].strftime("%Y-%m-%d"),
            'match_number': match['match_number'],
            'red_score': match['red_score'],
            'blue_score': match['blue_score'],
            'teams': {'red': [], 'blue': []},
        }

    cursor.execute("select * from \"MatchSquads\"")
    match_squads = cursor.fetchall()
    for row in match_squads:
        matches[
            row['date'], row['match_number']][
                'teams'][row['team']].append(
                    row['player'])

    json.dump(
        sorted(matches.values(),
               key=lambda elem: (elem['date'], elem['match_number'])),
        open(file_name, 'w'),
        indent=2,
    )


def load(connection, cursor, file_name):
    matches = json.load(open(file_name))

    '''
    payload = flask.request.get_json()
    cursor.execute(
        "SELECT date, array_agg(match_number) AS match_numbers "
        "FROM \"MatchMeta\" "
        "WHERE date='{date}'"
        "GROUP BY date".format(date=payload['date'])
    )

    data = cursor.fetchall()
    if not data:
        match_number = 0
    else:
        assert len(data) == 1
        match_numbers = sorted(data[0]['match_numbers'])
        assert len(match_numbers) <= 100

        for i, match in enumerate(match_numbers):
            assert i <= match
            if (i < match):
                match_number = i
                break
        else:
            match_number = len(match_numbers)
    '''

    for match in matches:
        # Not sure but the performance might be better if all match
        # metas are collected in python object first and inserted into
        # DB at the very end as a single operation.
        cursor.execute(
            "insert into \"MatchMeta\" "
            "(date, match_number, red_score, blue_score) "
            "values ('{date}', {match_number}, "
            "{red_score}, {blue_score})".format(
                date=match['date'],
                match_number=match['match_number'],
                red_score=match['red_score'],
                blue_score=match['blue_score'],
            )
        )

        inserted_rows = []
        for colour, team in match['teams'].items():
            for player in team:
                inserted_rows.append(
                    "('{date}', {match_number}, '{player}', '{team}')".format(
                        date=match['date'],
                        match_number=match['match_number'],
                        player=player,
                        team=colour,
                    )
                )

        cursor.execute(
            "INSERT INTO \"MatchSquads\" "
            "(date, match_number, player, team) "
            "VALUES {values};".format(
                values=', '.join(inserted_rows),
            )
        )

    connection.commit()


def clear(connection, cursor):
    cursor.execute('DELETE FROM "MatchMeta"')
    cursor.execute('DELETE FROM "MatchSquads"')
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
