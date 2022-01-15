import collections


def default_result_summary():
    return {
        'events': 0,
        'match': 0,
        'tournament': 0,
        'W': 0,
        'D': 0,
        'L': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4+': 0,
    }


def find_player_team(teams, player):
    for i, team in enumerate(teams):
        if player in team['squad']:
            return i
    return None


def represent_result(event_type, teams, player, team_id=None):
    if team_id is None:
        team_id = find_player_team(teams, player)
        if team_id is None:
            return None

    if event_type == 'match':
        if teams[team_id]['result'] > teams[1 - team_id]['result']:
            return 'W'
        if teams[team_id]['result'] == teams[1 - team_id]['result']:
            return 'D'
        assert teams[team_id]['result'] < teams[1 - team_id]['result']
        return 'L'

    assert event_type == 'tournament'

    if teams[team_id]['result'] > 3:
        return '4+'

    return str(teams[team_id]['result'])


def build_result_summary(events):
    result = collections.defaultdict(default_result_summary)

    for event in events:
        for i, team in enumerate(event['teams']):
            for player in team['squad']:
                result[player]['events'] += 1
                result[player][event['event_type']] += 1
                result[player][
                    represent_result(
                        event['event_type'], event['teams'], player, i)] += 1

    return result
