import collections

from foosta import elo
from foosta import shared


def build_total_stat(events):
    player_elo = elo.default_elo()
    for event in events:
        elo.update_elo(event, player_elo)

    response = shared.build_result_summary(events)
    assert set(player_elo.keys()) == set(response.keys())

    for player in player_elo:
        response[player]['elo'] = player_elo[player]

    return response


def default_streaks():
    def default_pair():
        return {
            'current': 0,
            'longest': 0,
        }

    return {
        'events': default_pair(),
        'wins': default_pair(),
        'no_wins': default_pair(),
        'gold': default_pair(),
        'no_gold': default_pair(),
    }


def update_streak(player_data, result, expected_result, streak_name):
    if result == expected_result:
        player_data[streak_name]['current'] += 1
        player_data[streak_name]['longest'] = max(
            player_data[streak_name]['longest'],
            player_data[streak_name]['current'],
        )

        player_data['no_' + streak_name]['current'] = 0
    else:
        player_data['no_' + streak_name]['current'] += 1
        player_data['no_' + streak_name]['longest'] = max(
            player_data['no_' + streak_name]['longest'],
            player_data['no_' + streak_name]['current'],
        )

        player_data[streak_name]['current'] = 0


def build_streaks(events, players):
    response = collections.defaultdict(default_streaks)

    for event in events:
        for player in players:
            result = shared.represent_result(
                event['event_type'], event['teams'], player)

            if result is None:
                response[player]['events']['current'] = 0
                continue

            response[player]['events']['current'] += 1
            response[player]['events']['longest'] = max(
                response[player]['events']['longest'],
                response[player]['events']['current'],
            )

            if event['event_type'] == 'match':
                update_streak(response[player], result, 'W', 'wins')
            else:
                assert event['event_type'] == 'tournament'
                update_streak(response[player], result, '1', 'gold')

    return response


def default_goals():
    return {
        'match': 0,
        'scored': 0,
        'conceded': 0,
    }


def build_goals(events):
    response = collections.defaultdict(default_goals)

    for event in events:
        if event['event_type'] == 'tournament':
            continue
        assert event['event_type'] == 'match'

        team_result = [
            event['teams'][0]['result'],
            event['teams'][1]['result'],
        ]
        for i, team in enumerate(event['teams']):
            for player in team['squad']:
                response[player]['match'] += 1
                response[player]['scored'] += team_result[i]
                response[player]['conceded'] += team_result[1 - i]

    return response
