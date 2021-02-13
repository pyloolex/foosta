import collections
import flask
import logging

from foosta import util


app = flask.Flask(__name__)

LOGGER = logging.getLogger(__name__)



@app.route('/matches', methods=['POST'])
def add_match():
    connection, cursor = util.connect_to_db()
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

    cursor.execute(
        "insert into \"MatchMeta\" "
        "(date, match_number, red_score, blue_score) "
        "values ('{date}', {match_number}, {red_score}, {blue_score})".format(
            date=payload['date'],
            match_number=match_number,
            red_score=payload['red_score'],
            blue_score=payload['blue_score'],
        )
    )

    inserted_rows = []
    for colour, team in payload['teams'].items():
        for player in team:
            inserted_rows.append(
                "('{date}', {match_number}, '{player}', '{team}')".format(
                    date=payload['date'],
                    match_number=match_number,
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

    match_id = payload['date'] + ':{:02d}'.format(match_number)
    return flask.jsonify({'id': match_id}), 201


@app.route('/matches', methods=['GET'])
def get_matches():
    connection, cursor = util.connect_to_db()

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

    return flask.jsonify({'items': list(matches.values())})


@app.route('/', methods=['GET', 'POST'])
def blah():
    connection, cursor = util.connect_to_db()
    if flask.request.method == 'GET':
        cursor.execute("select * from users")
        data = cursor.fetchall()

        return flask.jsonify({'items': data})
    elif flask.request.method == 'POST':
        data = {
            'salary': 100,
            'married': False,
        }
        payload = flask.request.get_json()
        if 'username' not in payload:
            return "'username' must be specified", 422

        for field in payload:
            data[field] = payload[field]

        cursor.execute(
            "insert into users (username, salary, married) "
            "values ('{username}', {salary}, {married})".format(
                username=data['username'],
                salary=data['salary'],
                married=data['married'],
            )
        )
        connection.commit()

        return flask.jsonify('Okay, got you, motherfucker'), 201


        #print(, file=sys.stderr)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7250)
