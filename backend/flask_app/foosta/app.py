import collections
import json
import logging
import os.path

import flask

from foosta import personal_stat
from foosta import shared
from foosta import total_stat
from foosta import util
import foosta.foosta_lollipop as s


app = flask.Flask(__name__)

LOGGER = logging.getLogger(__name__)

# TODO(pyloolex): Remove it from here as they are
# already in elo.py
DEFAULT_ELO = 1200
ELO_DIFF = 400
ELO_MULTIPLIER = 32


def get_event_number(cursor, date):
    cursor.execute(
        f"""SELECT date, array_agg(event_number) AS event_numbers """
        f"""FROM "EventMeta" """
        f"""WHERE date='{date}'"""
        f"""GROUP BY date"""
    )

    existing_events = cursor.fetchall()
    if not existing_events:
        return 0
    assert len(existing_events) == 1

    event_numbers = sorted(existing_events[0]['event_numbers'])

    for i, event_number in enumerate(event_numbers):
        assert i <= event_number
        if i < event_number:
            return i

    return len(event_numbers)


POST_EVENT_SCHEMA = s.Object(
    {
        'event_type': s.Enum(['match', 'tournament']),
        'date': s.Transform(
            s.Date('iso8601'),
            post_load=str,
        ),
        'teams': s.List(
            s.Object(
                {
                    'result': s.Integer(validate=s.Range(min=0, max=99)),
                    'squad': s.List(
                        s.String(validate=[s.Length(min=1)]),
                        validate=[s.Length(min=1), s.Unique()],
                    )
                },
                allow_extra_fields=False,
            ),
            validate=s.Length(min=2),
        ),
        'password': s.String(validate=[s.Length(min=1)]),
    },
    allow_extra_fields=False,
)


def validate_new_event(payload):
    data = POST_EVENT_SCHEMA.load(payload)

    # Verify password.
    with open(os.path.join(os.path.dirname(__file__),
                           'password_backend.json'),
              encoding='UTF-8') as password_file:
        if data['password'] != json.load(password_file):
            raise s.ValidationError({'password': 'Invalid password'})

    # Verify number of teams.
    if data['event_type'] == 'match' and len(data['teams']) != 2:
        raise s.ValidationError({'teams': (
            'There should be exactly two teams '
            'in case of "match" event type.')})

    # Verify uniqueness of player names.
    errors = s.ValidationErrorBuilder()
    players = set()
    for i, team in enumerate(data['teams']):
        invalid_players = set(team['squad']) & players
        if invalid_players:
            errors.add_errors({
                'teams': {
                    i: (f"""One player can't play for multiple """
                        f"""teams: {sorted(invalid_players)}.""")
                }
            })

        players |= set(team['squad'])

    errors.raise_errors()

    return data


def validate_and_prepare_data(cursor, payload):
    data = validate_new_event(payload)

    event_number = get_event_number(cursor, data['date'])
    if event_number >= 100:
        raise s.ValidationError('Too many events within one day.')

    data['event_number'] = event_number

    return data


def flatten_event_to_db(connection, cursor, data):
    # TODO(pyloolex): This is very bad. This provides huge room
    # for SQL-injections. Instead, `psycopg.sql.SQL` and
    # `cursor.execute(<query>, <arguments>)` must be used.
    #
    # Read
    # stackoverflow.com/questions/45128902/psycopg2-and-sql-injection-security
    # https://www.psycopg.org/docs/sql.html
    event_results = []
    event_squads = []
    for i, team_info in enumerate(data['teams']):
        event_results.append(
            f"""('{data["date"]}', {data["event_number"]}, {i}, """
            f"""{team_info["result"]})"""
        )
        for player in team_info['squad']:
            event_squads.append(
                f"""('{data["date"]}', {data["event_number"]}, """
                f"""'{player}', {i})"""
            )

    cursor.execute(
        f"""INSERT INTO "EventMeta" """
        f"""(date, event_number, event_type) """
        f"""VALUES ('{data["date"]}', {data["event_number"]}, """
        f"""'{data["event_type"]}')"""
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


@app.route('/events', methods=['POST'])
def add_event():
    connection, cursor = util.connect_to_db()
    payload = flask.request.get_json()

    try:
        data = validate_and_prepare_data(cursor, payload)
    except s.ValidationError as exc:
        return flask.jsonify({'errors': exc.messages}), 422

    flatten_event_to_db(connection, cursor, data)

    event_id = util.make_event_key(data['date'], data['event_number'])
    return flask.jsonify({'id': event_id}), 201


@app.route('/events', methods=['GET'])
def get_events():
    _, cursor = util.connect_to_db()

    events = util.translate_events(cursor)

    items = {
        util.make_event_key(event['date'], event['event_number']): event
        for event in events.values()
    }

    return flask.jsonify({'items': items}), 200


@app.route('/stats/elo', methods=['GET'])
def get_elo():
    # This method will be refactored.
    # pylint: disable=too-many-locals

    _, cursor = util.connect_to_db()

    events = util.translate_events(cursor)

    player_elo = collections.defaultdict(lambda: DEFAULT_ELO)
    participated = collections.defaultdict(int)
    for event in sorted(events.values(), key=lambda event: event['date']):
        teams = event['teams']
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

        # LOGGER.error('--ELO DIFF--')
        # for i, team in enumerate(teams):
        #     LOGGER.error(
        #         '%s %s : %s',
        #         team_elo[i], team['result'], team_elo_diff[i],
        #     )
        # LOGGER.error('==ELO DIFF==')

    response = {
        player: {
            'participated': played,
            'elo': player_elo[player],
        }
        for player, played in participated.items()
    }

    return flask.jsonify({'items': response})


@app.route('/stats', methods=['GET'])
def get_total_stats():
    _, cursor = util.connect_to_db()
    events = util.translate_and_sort_events(cursor)

    total = total_stat.build_total_stat(events)

    response = {
        'total': total,
        'streaks': total_stat.build_streaks(events, total.keys()),
        'goals': total_stat.build_goals(events),
    }

    return flask.jsonify(response), 200


@app.route('/stats/<hero>', methods=['GET'])
def get_personal_stats(hero):
    _, cursor = util.connect_to_db()

    events = util.translate_and_sort_events(cursor)

    result_summary = shared.build_result_summary(events)
    if hero not in result_summary:
        return flask.jsonify({
            'errors': f"Player '{hero}' doesn't exist"}), 404

    response = {
        'elo': personal_stat.build_persisted_elo(events, hero),
        'teammates': personal_stat.build_stat_teammates(events, hero),
        'rivals': personal_stat.build_stat_rivals(events, hero),
        'result_summary': result_summary[hero],
    }

    return flask.jsonify(response), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7250)
