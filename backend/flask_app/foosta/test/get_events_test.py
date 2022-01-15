import unittest

from foosta.test import base


class GetEventsTest(base.BaseFoostaApiTest):
    def test_get_events(self):
        self.add_event({
            'date': '2010-03-13',
            'event_number': 0,
            'event_type': 'match',
            'teams': [
                {
                    'result': 8,
                    'squad': ['Aaron', 'Brian'],
                },
                {
                    'result': 4,
                    'squad': ['Charles'],
                },
            ],
        })
        self.add_event({
            'date': '2010-07-31',
            'event_number': 34,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 2,
                    'squad': ['Ben', 'Aaron'],
                },
                {
                    'result': 1,
                    'squad': ['Brian', 'Charles'],
                },
                {
                    'result': 3,
                    'squad': ['Erick', 'Frank', 'Dave'],
                },
            ],
        })

        response = self.client.get('/events')

        self.assertEqual(
            {
                'items': {
                    '2010-03-13:00': {
                        'date': '2010-03-13',
                        'event_number': 0,
                        'event_type': 'match',
                        'teams': [
                            {
                                'result': 4,
                                'squad': ['Charles'],
                            },
                            {
                                'result': 8,
                                'squad': ['Aaron', 'Brian'],
                            },
                        ]
                    },
                    '2010-07-31:34': {
                        'date': '2010-07-31',
                        'event_number': 34,
                        'event_type': 'tournament',
                        'teams': [
                            {
                                'result': 1,
                                'squad': ['Brian', 'Charles'],
                            },
                            {
                                'result': 2,
                                'squad': ['Aaron', 'Ben'],
                            },
                            {
                                'result': 3,
                                'squad': ['Dave', 'Erick', 'Frank'],
                            },
                        ]
                    }
                }
            },
            response.json,
        )
        self.assertEqual(200, response.status_code)


if __name__ == '__main__':
    unittest.main()
