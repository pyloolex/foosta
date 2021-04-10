import collections
import flask
import logging

from foosta import util


app = flask.Flask(__name__)

LOGGER = logging.getLogger(__name__)

DEFAULT_ELO = 1200
ELO_DIFF = 200
ELO_MULTIPLIER = 30


def get_event_number(cursor, date):
    cursor.execute(
        "SELECT date, array_agg(event_number) AS event_numbers "
        "FROM \"EventMeta\" "
        "WHERE date='{date}'"
        "GROUP BY date".format(date=date)
    )

    existing_events = cursor.fetchall()
    if not existing_events:
        return 0
    assert len(existing_events) == 1

    event_numbers = sorted(existing_events[0]['event_numbers'])
    if len(event_numbers) >= 100:
        return None

    for i, event_number in enumerate(event_numbers):
        assert i <= event_number
        if (i < event_number):
            return i

    return len(event_numbers)


@app.route('/events', methods=['POST'])
def add_event():
    connection, cursor = util.connect_to_db()
    payload = flask.request.get_json()

    event_number = get_event_number(cursor, payload['date'])
    if event_number is None:
        return flask.jsonify({
            'error': 'Too many events within one day'}), 409

    # TODO(ferc): Validate that there are exactly two teams in case
    # of "match" event.
    event_results = []
    event_squads = []
    for i, team_info in enumerate(payload['teams']):
        event_results.append(
            "('{date}', {event_number}, {team}, {result})".format(
                date=payload['date'],
                event_number=event_number,
                team=i,
                result=team_info['result'],
            )
        )
        for player in team_info['squad']:
            event_squads.append(
                "('{date}', {event_number}, '{player}', {team})".format(
                    date=payload['date'],
                    event_number=event_number,
                    player=player,
                    team=i,
                )
            )

    cursor.execute(
        "insert into \"EventMeta\" "
        "(date, event_number, event_type) "
        "values ('{date}', {event_number}, '{event_type}')".format(
            date=payload['date'],
            event_number=event_number,
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

    event_id = util.make_event_key(payload['date'], event_number)
    return flask.jsonify({'id': event_id}), 201


@app.route('/events', methods=['GET'])
def get_events():
    connection, cursor = util.connect_to_db()

    events = util.translate_events(connection, cursor)

    items = {
        util.make_event_key(event['date'], event['event_number']): dict(
            event,
            teams=list(event['teams'].values())
        )
        for event in events.values()
    }

    return flask.jsonify({'items': items})


@app.route('/stats/elo', methods=['GET'])
def get_elo():
    connection, cursor = util.connect_to_db()

    events = util.translate_events(connection, cursor)

    player_elo = collections.defaultdict(lambda: DEFAULT_ELO)
    participated = collections.defaultdict(int)
    for event in sorted(events.values(), key=lambda event: event['date']):
        teams = list(event['teams'].values())
        team_elo = {}
        for i, team in enumerate(teams):
            total = 0
            for player in team['squad']:
                total += player_elo[player]
                participated[player] += 1
            team_elo[i] = total // len(team['squad'])

        team_elo_diff = {i: 0 for i, _ in enumerate(teams)}
        for i, _ in enumerate(teams):
            for j in range(i + 1, len(teams)):
                win_odds = (
                    1
                    /
                    (1 + 10 ** ((team_elo[j] - team_elo[i]) / ELO_DIFF))
                )
                if teams[i]['result'] == teams[j]['result']:
                    actual_res = 0.5
                elif event['event_type'] == 'match':
                    actual_res = float(teams[i]['result'] > teams[j]['result'])
                else:
                    assert event['event_type'] == 'tournament'
                    actual_res = float(teams[i]['result'] < teams[j]['result'])

                coef = int(ELO_MULTIPLIER * (actual_res - win_odds))
                team_elo_diff[i] += coef
                team_elo_diff[j] -= coef

        for i, team in enumerate(teams):
            for player in team['squad']:
                player_elo[player] += team_elo_diff[i]

        '''
        LOGGER.error('--ELO DIFF--')
        for i, team in enumerate(teams):
            LOGGER.error(
                '%s %s : %s',
                team_elo[i], team['result'], team_elo_diff[i],
            )
        LOGGER.error('==ELO DIFF==')
        '''

    response = {
        player: {
            'participated': played,
            'elo': player_elo[player],
        }
        for player, played in participated.items()
    }

    return flask.jsonify({'items': response})




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
