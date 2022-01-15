import collections

from foosta import common
from foosta import elo


def build_persisted_elo(events, hero):
    response = []

    player_elo = elo.default_elo()
    for event in events:
        elo.update_elo(event, player_elo)

        response.append({
            'date': event['date'],
            'event_number': event['event_number'],
            'result': common.represent_result(
                event['event_type'], event['teams'], hero),
            'rating': player_elo[hero],
        })

    return response


def build_stat_teammates(events, hero):
    response = collections.defaultdict(common.default_result_summary)

    for event in events:
        team_id = common.find_player_team(event['teams'], hero)
        if team_id is None:
            # Hero doesn't play this game.
            continue

        result = common.represent_result(
            event['event_type'], event['teams'], hero, team_id)
        for player in event['teams'][team_id]['squad']:
            if player == hero:
                continue

            response[player]['events'] += 1
            response[player][event['event_type']] += 1
            response[player][result] += 1

    return response


def build_stat_rivals(events, hero):
    response = collections.defaultdict(common.default_result_summary)

    for event in events:
        team_id = common.find_player_team(event['teams'], hero)
        if team_id is None:
            # Hero doesn't play this game.
            continue

        result = common.represent_result(
            event['event_type'], event['teams'], hero, team_id)
        for i, team in enumerate(event['teams']):
            if i == team_id:
                continue

            for player in team['squad']:
                response[player]['events'] += 1
                response[player][event['event_type']] += 1
                response[player][result] += 1

    return response
