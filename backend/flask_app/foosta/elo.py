import collections


DEFAULT_ELO = 1200
ELO_DIFF = 400
ELO_K = 32


def default_elo():
    return collections.defaultdict(lambda: DEFAULT_ELO)


def calc_team_elo(player_elo, teams):
    team_elo = []

    for team in teams:
        rating_sum = 0
        for player in team['squad']:
            rating_sum += player_elo[player]
        # Truncate fractional part, it's not a big deal.
        team_elo.append(rating_sum // len(team['squad']))

    return team_elo


def calc_elo_change(event_type,
                    first_info, second_info,
                    first_rating, second_rating):
    expected = (
        1
        /
        (1 + 10 ** ((second_rating - first_rating) / ELO_DIFF))
    )
    if first_info['result'] == second_info['result']:
        actual = 0.5
    elif event_type == 'match':
        actual = float(first_info['result'] > second_info['result'])
    else:
        assert event_type == 'tournament'
        actual = float(first_info['result'] < second_info['result'])

    return int(ELO_K * (actual - expected))


def update_elo(event, player_elo):
    teams = event['teams']
    team_elo = calc_team_elo(player_elo, teams)

    team_diff = [0] * len(teams)
    for i, _ in enumerate(teams):
        for j in range(i):
            change = calc_elo_change(
                event['event_type'],
                teams[i], teams[j],
                team_elo[i], team_elo[j],
            )
            team_diff[i] += change
            team_diff[j] -= change

    for i, team in enumerate(teams):
        for player in team['squad']:
            player_elo[player] += team_diff[i]
