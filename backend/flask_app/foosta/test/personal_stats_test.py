import unittest
import urllib

from foosta.test import base


class PersonalStatsTest(base.BaseFoostaApiTest):
    def assert_big_response(self, expected, actual):
        # Comparing expected and actual by parts because it's
        # easier to debug in case they don't match.
        self.assertCountEqual(expected, actual)

        for i, expected_elo in enumerate(expected['elo']):
            self.assertEqual(expected_elo, actual['elo'][i], i)

        self.assertCountEqual(expected['teammates'], actual['teammates'])
        for teammate, data in expected['teammates'].items():
            self.assertDictEqual(d2=actual['teammates'][teammate],
                                 d1=data,
                                 msg=teammate)

        self.assertCountEqual(expected['rivals'], actual['rivals'])
        for rival, data in expected['rivals'].items():
            self.assertDictEqual(d2=actual['rivals'][rival],
                                 d1=data,
                                 msg=rival)

        self.assertDictEqual(
            expected['result_summary'],
            actual['result_summary'],
        )

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

        response = self.client.get('/stats/Ashton')

        self.assert_big_response(
            {
                'elo': [
                    {
                        'date': '2009-01-03',
                        'event_number': 0,
                        'result': None,
                        'rating': 1200,
                    },
                    {
                        'date': '2010-01-01',
                        'event_number': 0,
                        'result': 'W',
                        'rating': 1216,
                    },
                    {
                        'date': '2010-01-02',
                        'event_number': 0,
                        'result': '1',
                        'rating': 1230,
                    },
                    {
                        'date': '2010-01-04',
                        'event_number': 0,
                        'result': 'L',
                        'rating': 1214,
                    },
                    {
                        'date': '2010-01-04',
                        'event_number': 1,
                        'result': 'D',
                        'rating': 1214,
                    },
                    {
                        'date': '2010-01-05',
                        'event_number': 0,
                        'result': 'L',
                        'rating': 1198,
                    },
                    {
                        'date': '2010-01-06',
                        'event_number': 0,
                        'result': None,
                        'rating': 1198,
                    },
                    {
                        'date': '2010-01-07',
                        'event_number': 0,
                        'result': 'L',
                        'rating': 1185,
                    },
                    {
                        'date': '2010-01-08',
                        'event_number': 0,
                        'result': '4+',
                        'rating': 1124,
                    },
                    {
                        'date': '2010-02-01',
                        'event_number': 0,
                        'result': '3',
                        'rating': 1091,
                    },
                    {
                        'date': '2010-03-01',
                        'event_number': 0,
                        'result': '2',
                        'rating': 1094,
                    },
                    {
                        'date': '2010-03-14',
                        'event_number': 0,
                        'result': '4+',
                        'rating': 1050,
                    },
                ],
                'teammates': {
                    'Benny': {
                        'events': 7,
                        'match': 3,
                        'tournament': 4,
                        'W': 1,
                        'D': 1,
                        'L': 1,
                        '1': 1,
                        '2': 1,
                        '3': 1,
                        '4+': 1,
                    },
                    'Charles': {
                        'events': 5,
                        'match': 4,
                        'tournament': 1,
                        'W': 0,
                        'D': 1,
                        'L': 3,
                        '1': 1,
                        '2': 0,
                        '3': 0,
                        '4+': 0,
                    },
                    'Elon': {
                        'events': 4,
                        'match': 4,
                        'tournament': 0,
                        'W': 0,
                        'D': 1,
                        'L': 3,
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4+': 0,
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
                    },
                },
                'rivals': {
                    'Benny': {
                        'events': 2,
                        'match': 1,
                        'tournament': 1,
                        'W': 0,
                        'D': 0,
                        'L': 1,
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4+': 1,
                    },
                    'Charles': {
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
                    },
                    'Dave': {
                        'events': 9,
                        'match': 4,
                        'tournament': 5,
                        'W': 1,
                        'D': 1,
                        'L': 2,
                        '1': 1,
                        '2': 1,
                        '3': 1,
                        '4+': 2,
                    },
                    'Elon': {
                        'events': 5,
                        'match': 0,
                        'tournament': 5,
                        'W': 0,
                        'D': 0,
                        'L': 0,
                        '1': 1,
                        '2': 1,
                        '3': 1,
                        '4+': 2,
                    },
                    'Garry': {
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
                    },
                },
                'result_summary': {
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
                },
            },
            response.json,
        )
        self.assertEqual(200, response.status_code)

    def test_unknown_user(self):
        response = self.client.get('/stats/unknown')

        self.assertEqual(
            {'errors': "Player 'unknown' doesn't exist"},
            response.json,
        )
        self.assertEqual(404, response.status_code)

    def test_tricky_name(self):
        # `/` and is not supported on purpose because it brings headaches
        # for users trying to enter URL manually.
        # TODO(pyloolex): Add `'` as well after the problem with SQL-injection
        # has been resolved.
        tricky_name = '@?* .,|"()#$%^&+[]'

        self.add_event({
            'date': '2010-01-01',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 8,
                    'squad': [tricky_name, 'Aaron'],
                },
                {
                    'result': 4,
                    'squad': ['Charles'],
                },
            ],
        })

        quoted_name = urllib.parse.quote(tricky_name)
        response = self.client.get('/stats/' + quoted_name)

        self.assertEqual(
            {
                'elo': [
                    {'date': '2010-01-01',
                     'event_number': 0,
                     'rating': 1216,
                     'result': 'W'},
                ],
                'rivals': {
                    'Charles': {
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4+': 0,
                        'D': 0,
                        'L': 0,
                        'W': 1,
                        'events': 1,
                        'match': 1,
                        'tournament': 0,
                    }
                },
                'teammates': {
                    'Aaron': {
                        '1': 0,
                        '2': 0,
                        '3': 0,
                        '4+': 0,
                        'D': 0,
                        'L': 0,
                        'W': 1,
                        'events': 1,
                        'match': 1,
                        'tournament': 0,
                    }
                },
                'result_summary': {
                    '1': 0,
                    '2': 0,
                    '3': 0,
                    '4+': 0,
                    'D': 0,
                    'L': 0,
                    'W': 1,
                    'events': 1,
                    'match': 1,
                    'tournament': 0,
                },
            },
            response.json,
        )
        self.assertEqual(200, response.status_code)


if __name__ == '__main__':
    unittest.main()
