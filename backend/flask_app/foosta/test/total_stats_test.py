import unittest

from foosta.test import base


class TotalStatsTest(base.BaseFoostaApiTest):
    def assert_big_response(self, expected, actual):
        # Comparing expected and actual by parts because it's
        # easier to debug in case they don't match.
        self.assertCountEqual(expected, actual)

        self.assertCountEqual(expected['total'], actual['total'])
        for player, data in expected['total'].items():
            self.assertDictEqual(d2=actual['total'][player],
                                 d1=data,
                                 msg=player)

        self.assertCountEqual(expected['streaks'], actual['streaks'])
        for player, data in expected['streaks'].items():
            self.assertDictEqual(d2=actual['streaks'][player],
                                 d1=data,
                                 msg=player)

        self.assertCountEqual(expected['goals'], actual['goals'])
        for player, data in expected['goals'].items():
            self.assertDictEqual(d2=actual['goals'][player],
                                 d1=data,
                                 msg=player)

    def test_sanity(self):
        self.add_event({  # Ashton skips match.
            'date': '2009-01-03',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 18,
                    'squad': ['Benny', 'Dave'],
                },
                {
                    'result': 14,
                    'squad': ['Elon'],
                },
            ],
        })
        self.add_event({  # Win, Benny in, Dave out.
            'date': '2010-01-01',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 8,
                    'squad': ['Ashton', 'Benny'],
                },
                {
                    'result': 4,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # 1, Benny in, Dave out.
            'date': '2010-01-02',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 1,
                    'squad': ['Ashton', 'Benny', 'Charles'],
                },
                {
                    'result': 2,
                    'squad': ['Dave', 'Elon'],
                },
            ],
        })
        self.add_event({  # Benny skips match.
            'date': '2010-01-04',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 1,
                    'squad': ['Ashton', 'Charles', 'Elon'],
                },
                {
                    'result': 14,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # Draw, Benny in, Dave out
            'date': '2010-01-04',
            'event_number': 1,
            'event_type': 'match',
            'teams': [
                {
                    'result': 18,
                    'squad': ['Ashton', 'Benny', 'Charles', 'Elon'],
                },
                {
                    'result': 18,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # Lose, Benny in, Dave out
            'date': '2010-01-05',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 12,
                    'squad': ['Ashton', 'Benny', 'Charles', 'Elon'],
                },
                {
                    'result': 14,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # Ashton and Benny skip tournament.
            'date': '2010-01-06',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 1,
                    'squad': ['Charles', 'Dave'],
                },
                {
                    'result': 2,
                    'squad': ['Elon'],
                },
            ],
        })
        self.add_event({  # Dave skips match, Benny out.
            'date': '2010-01-07',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 13,
                    'squad': ['Ashton', 'Charles', 'Elon'],
                },
                {
                    'result': 18,
                    'squad': ['Benny'],
                },
            ],
        })
        self.add_event({  # 5, Dave and Benny out.
            'date': '2010-01-08',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 5,
                    'squad': ['Ashton'],
                },
                {
                    'result': 1,
                    'squad': ['Benny'],
                },
                {
                    'result': 2,
                    'squad': ['Dave'],
                },
                {
                    'result': 4,
                    'squad': ['Charles'],
                },
                {
                    'result': 3,
                    'squad': ['Elon'],
                },
            ],
        })
        self.add_event({  # 3, Benny in, Dave out.
            'date': '2010-02-01',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 3,
                    'squad': ['Ashton', 'Benny'],
                },
                {
                    'result': 1,
                    'squad': ['Elon'],
                },
                {
                    'result': 2,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # 2, Benny in, Dave out.
            'date': '2010-03-01',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 2,
                    'squad': ['Ashton', 'Benny'],
                },
                {
                    'result': 3,
                    'squad': ['Elon'],
                },
                {
                    'result': 1,
                    'squad': ['Dave'],
                },
            ],
        })
        self.add_event({  # 4, Benny in, Dave out.
            'date': '2010-03-14',
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 4,
                    'squad': ['Ashton', 'Benny', 'Frank'],
                },
                {
                    'result': 3,
                    'squad': ['Elon'],
                },
                {
                    'result': 1,
                    'squad': ['Dave'],
                },
                {
                    'result': 2,
                    'squad': ['Garry'],
                },
            ],
        })

        response = self.client.get('/stats')

        self.assert_big_response(
            {
                'total': {
                    'Ashton': {
                        'events': 10,
                        'match': 5,
                        'tournament': 5,
                        'W': 1,
                        'D': 1,
                        'L': 3,
                        '1': 1,
                        '2': 1,
                        '3': 1,
                        '4+': 2,
                        'elo': 1050,
                    },
                    'Benny': {
                        'events': 10,
                        'match': 5,
                        'tournament': 5,
                        'W': 3,
                        'D': 1,
                        'L': 1,
                        '1': 2,
                        '2': 1,
                        '3': 1,
                        '4+': 1,
                        'elo': 1220,
                    },
                    'Charles': {
                        'events': 7,
                        'match': 4,
                        'tournament': 3,
                        'W': 0,
                        'D': 1,
                        'L': 3,
                        '1': 2,
                        '2': 0,
                        '3': 0,
                        '4+': 1,
                        'elo': 1153,
                    },
                    'Dave': {
                        'events': 11,
                        'match': 5,
                        'tournament': 6,
                        'W': 3,
                        'D': 1,
                        'L': 1,
                        '1': 3,
                        '2': 3,
                        '3': 0,
                        '4+': 0,
                        'elo': 1303,
                    },
                    'Elon': {
                        'events': 11,
                        'match': 5,
                        'tournament': 6,
                        'W': 0,
                        'D': 1,
                        'L': 4,
                        '1': 1,
                        '2': 2,
                        '3': 3,
                        '4+': 0,
                        'elo': 1137,
                    },
                    'Frank': {
                        'events': 1,
                        'match': 0,
                        'tournament': 1,
                        'W': 0,
                        'D': 0,
                        'L': 0,
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4+': 1,
                        'elo': 1156,
                    },
                    'Garry': {
                        'events': 1,
                        'match': 0,
                        'tournament': 1,
                        'W': 0,
                        'D': 0,
                        'L': 0,
                        '1': 0,
                        '2': 1,
                        '3': 0,
                        '4+': 0,
                        'elo': 1216,
                    },
                },
                'streaks': {
                    'Ashton': {
                        'events': {
                            'current': 5,
                            'longest': 5,
                        },
                        'wins': {
                            'current': 0,
                            'longest': 1,
                        },
                        'no_wins': {
                            'current': 4,
                            'longest': 4,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 1,
                        },
                        'no_gold': {
                            'current': 4,
                            'longest': 4,
                        },
                    },
                    'Benny': {
                        'events': {
                            'current': 5,
                            'longest': 5,
                        },
                        'wins': {
                            'current': 1,
                            'longest': 2,
                        },
                        'no_wins': {
                            'current': 0,
                            'longest': 2,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 2,
                        },
                        'no_gold': {
                            'current': 3,
                            'longest': 3,
                        },
                    },
                    'Charles': {
                        'events': {
                            'current': 0,
                            'longest': 7,
                        },
                        'wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_wins': {
                            'current': 4,
                            'longest': 4,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 2,
                        },
                        'no_gold': {
                            'current': 1,
                            'longest': 1,
                        },
                    },
                    'Dave': {
                        'events': {
                            'current': 4,
                            'longest': 7,
                        },
                        'wins': {
                            'current': 1,
                            'longest': 1,
                        },
                        'no_wins': {
                            'current': 0,
                            'longest': 1,
                        },
                        'gold': {
                            'current': 2,
                            'longest': 2,
                        },
                        'no_gold': {
                            'current': 0,
                            'longest': 2,
                        },
                    },
                    'Elon': {
                        'events': {
                            'current': 10,
                            'longest': 10,
                        },
                        'wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_wins': {
                            'current': 5,
                            'longest': 5,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 1,
                        },
                        'no_gold': {
                            'current': 2,
                            'longest': 3,
                        },
                    },
                    'Frank': {
                        'events': {
                            'current': 1,
                            'longest': 1,
                        },
                        'wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_gold': {
                            'current': 1,
                            'longest': 1,
                        },
                    },
                    'Garry': {
                        'events': {
                            'current': 1,
                            'longest': 1,
                        },
                        'wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_wins': {
                            'current': 0,
                            'longest': 0,
                        },
                        'gold': {
                            'current': 0,
                            'longest': 0,
                        },
                        'no_gold': {
                            'current': 1,
                            'longest': 1,
                        },
                    },
                },
                'goals': {
                    'Ashton': {
                        'match': 5,
                        'scored': 52,
                        'conceded': 68,
                    },
                    'Benny': {
                        'match': 5,
                        'scored': 74,
                        'conceded': 63,
                    },
                    'Charles': {
                        'match': 4,
                        'scored': 44,
                        'conceded': 64,
                    },
                    'Dave': {
                        'match': 5,
                        'scored': 68,
                        'conceded': 53,
                    },
                    'Elon': {
                        'match': 5,
                        'scored': 58,
                        'conceded': 82,
                    },
                },
            },
            response.json,
        )
        self.assertEqual(200, response.status_code)


if __name__ == '__main__':
    unittest.main()
