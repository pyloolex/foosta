```
{
    'elo': [
        {
            'date': '2010-02-02',
            'event_number': 0,
            'result': '1', # First place.
            'rating': '1420',
        },
        {
            'date': '2010-02-02',
            'event_number': 1,  # Hidden from user.
            'result': 'D', # Draw.
            'rating': '1409',
        },
    ],
    'teammates': {
        'Dima': {
            'event_count': 15,

            'match_count': 10,
            'W': 4,
            'D': 3,
            'L': 3, # Sum: 10.

            'tournament_count': 5,
            '1': 2,
            '2': 1,
            '3': 1,
            '4+': 1, # Sum: 5.
        },
    },
    'rivals': {
        'Dima': {
            'event_count': 13,

            'match_count': 4,
            'W': 1,
            'D': 1,
            'L': 2,

            'tournament_count': 9,
            '1': 2,
            '2': 1,
            '3': 3,
            '4+': 3,
        },
    },
    'squad': {
        'Dima': {
            'W': 2,
            'D': 1,
            'L': 3,

            '1': 4,
            '2': 1,  # UI will show this numbers on hover (0/1).
            '3': 0,  # When not on hover, it will divide it
            '4+': 0,  # by 'result_summary' (43.2%)
        },
    },
    'confrontation': {
        'Dima': {
            'W': 5,
            'D': 8,
            'L': 9,

            '1': 3,
            '2': 7,
            '3': 3,
            '4+': 2,
        },
    },
    'result_summary': {
        'W': 10,
        'D': 14,
        'L': 4,

        '1': 2,
        '2': 5,
        '3': 7,
        '4+': 1,
    }
}


#

'''
D = 400
K = 32

while True:
    a, b = map(int, input().split(' '))

    ea = 1 / (1 + (10 ** ((b - a) / D)))
    eb = 1 / (1 + (10 ** ((a - b) / D)))

    print(round(ea, 2), round(eb, 2), round(K * (1 - ea), 2))
'''
