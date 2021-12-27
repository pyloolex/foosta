import json
import os
import os.path
import unittest

from foosta import util
from foosta.test import base


class PostEventTest(base.BaseFoostaApiTest):
    def setUp(self, *args, **kwargs):
        super().setUp(*args, **kwargs)

        self.maxDiff = None  # pylint: disable=invalid-name

        # Fill up the database with some predefined events.
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
            'event_number': 0,
            'event_type': 'tournament',
            'teams': [
                {
                    'result': 2,
                    'squad': ['Aaron', 'Ben'],
                },
                {
                    'result': 1,
                    'squad': ['Brian', 'Charles'],
                },
                {
                    'result': 3,
                    'squad': ['Dave', 'Erick', 'Frank'],
                },
            ],
        })

        self.password_file_name = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'password_backend.json',
        )

        with open(self.password_file_name, 'w',
                  encoding='UTF-8') as password_file:
            json.dump("Good morning!", password_file)

    def tearDown(self, *args, **kwargs):
        os.remove(self.password_file_name)

        super().tearDown(*args, **kwargs)

    def assert_db_is_intact(self):
        self.assert_events([
            {
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
            },
            {
                'date': '2010-07-31',
                'event_number': 0,
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 2,
                        'squad': ['Aaron', 'Ben'],
                    },
                    {
                        'result': 1,
                        'squad': ['Brian', 'Charles'],
                    },
                    {
                        'result': 3,
                        'squad': ['Dave', 'Erick', 'Frank'],
                    },
                ],
            },
        ])

    def assert_events(self, expected_events):
        translated_events = util.translate_events(self.db_cursor)
        actual_events = {
            (str(key[0]), key[1]): dict(
                event,
                teams=list(event['teams'].values())
            )
            for key, event in translated_events.items()
        }

        self.assertEqual(len(expected_events), len(actual_events))

        for expected in expected_events:
            key = (expected['date'], expected['event_number'])
            self.assertIn(key, actual_events)
            actual = actual_events[key]

            self.assertEqual(expected['date'], actual['date'])
            self.assertEqual(expected['event_number'], actual['event_number'])
            self.assertEqual(expected['event_type'], actual['event_type'])
            self.assertCountEqual(
                expected['teams'],
                actual['teams'],
            )

    def test_add_match_ok(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-03-13',
                'event_type': 'match',
                'teams': [
                    {
                        'result': 15,
                        'squad': ['Aaron', 'Bruce'],
                    },
                    {
                        'result': 0,
                        'squad': ['Marty'],
                    }
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual({'id': '2010-03-13:01'}, response.json)
        self.assertEqual(201, response.status_code)

        self.assert_events([
            {
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
            },
            {
                'date': '2010-07-31',
                'event_number': 0,
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 2,
                        'squad': ['Aaron', 'Ben'],
                    },
                    {
                        'result': 1,
                        'squad': ['Brian', 'Charles'],
                    },
                    {
                        'result': 3,
                        'squad': ['Dave', 'Erick', 'Frank'],
                    },
                ],
            },
            {
                'date': '2010-03-13',
                'event_number': 1,
                'event_type': 'match',
                'teams': [
                    {
                        'result': 15,
                        'squad': ['Aaron', 'Bruce'],
                    },
                    {
                        'result': 0,
                        'squad': ['Marty'],
                    }
                ],
            },
        ])

    def test_add_tournament_ok(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-03-15',
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['Andrew', 'Bruce'],
                    },
                    {
                        'result': 2,
                        'squad': ['Drake'],
                    },
                    {
                        'result': 3,
                        'squad': ['Vincent', 'Ben', 'Tim'],
                    },
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual({'id': '2010-03-15:00'}, response.json)
        self.assertEqual(201, response.status_code)

        self.assert_events([
            {
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
            },
            {
                'date': '2010-07-31',
                'event_number': 0,
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 2,
                        'squad': ['Aaron', 'Ben'],
                    },
                    {
                        'result': 1,
                        'squad': ['Brian', 'Charles'],
                    },
                    {
                        'result': 3,
                        'squad': ['Dave', 'Erick', 'Frank'],
                    },
                ],
            },
            {
                'date': '2010-03-15',
                'event_number': 0,
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['Andrew', 'Bruce'],
                    },
                    {
                        'result': 2,
                        'squad': ['Drake'],
                    },
                    {
                        'result': 3,
                        'squad': ['Vincent', 'Ben', 'Tim'],
                    },
                ],
            },
        ])

    def test_missing_fields(self):
        response = self.client.post(
            '/events',
            json={
                'abacaba': 'abacabadabacaba',
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'date': 'Value is required',
                    'event_type': 'Value is required',
                    'teams': 'Value is required',
                    'password': 'Value is required',
                    'abacaba': 'Unknown field',
                },
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_invalid_types(self):
        response = self.client.post(
            '/events',
            json={
                'date': '13.01.2007',
                'event_type': 'sql',
                'teams': {
                    'red': 'dre',
                    'blue': 'uebl',
                },
                'password': 142,
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'date': 'Value should match date format',
                    'event_type': 'Invalid choice',
                    'teams': 'Value should be list',
                    'password': 'Value should be string',
                },
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_invalid_teams_object(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'match',
                'teams': [
                    777,
                    {
                        'foo': 'bar',
                    },
                    {
                        'result': 'good',
                        'squad': {0: ['a']},
                    },
                    {
                        'result': 500,
                        'squad': True,
                    },
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'teams': {
                        '0': 'Value should be dict',
                        '1': {
                            'result': 'Value is required',
                            'squad': 'Value is required',
                            'foo': 'Unknown field',
                        },
                        '2': {
                            'result': 'Value should be integer',
                            'squad': 'Value should be list',
                        },
                        '3': {
                            'result': (
                                'Value should be at least 0 and at most 99'),
                            'squad': 'Value should be list',
                        }
                    },
                },
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_invalid_squad_object(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'match',
                'teams': [
                    {
                        'result': 1,
                        'squad': [],
                    },
                    {
                        'result': 1,
                        'squad': [True, ''],
                    },
                    {
                        'result': 1,
                        'squad': ['a', 'a'],
                    },
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'teams': {
                        '0': {
                            'squad': 'Length should be at least 1',
                        },
                        '1': {
                            'squad': {
                                '0': 'Value should be string',
                                '1': 'Length should be at least 1',
                            },
                        },
                        '2': {
                            'squad': 'Values are not unique',
                        },
                    },
                },
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_empty_teams(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'tournament',
                'teams': [],
                'password': 'Good morning!',
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'teams': 'Length should be at least 2',
                },
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_too_many_teams_in_match(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'match',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['a'],
                    },
                    {
                        'result': 2,
                        'squad': ['b'],
                    },
                    {
                        'result': 3,
                        'squad': ['c'],
                    },
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual(
            {
                'errors': {'teams': ('There should be exactly two teams '
                                     'in case of "match" event type.')},
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_not_unique_players_across_teams(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['a'],
                    },
                    {
                        'result': 2,
                        'squad': ['b', 'c'],
                    },
                    {
                        'result': 2,
                        'squad': ['a', 'b', 'd'],
                    },
                ],
                'password': 'Good morning!',
            },
        )

        self.assertEqual(
            {
                'errors': {
                    'teams': {
                        '2': ("One player can't play for multiple teams: "
                              "['a', 'b']."),
                    }
                }
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_too_many_events_within_a_day(self):
        for i in range(99):
            self.add_event({
                'date': '2011-02-12',
                'event_number': i,
                'event_type': 'match',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['Peter', 'Quentin'],
                    },
                    {
                        'result': 0,
                        'squad': ['Richard'],
                    },
                ],
            })

        response = self.client.post(
            '/events',
            json={
                'date': '2011-02-12',
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['a'],
                    },
                    {
                        'result': 2,
                        'squad': ['b', 'c'],
                    },
                ],
                'password': 'Good morning!',
            },
        )
        self.assertEqual({'id': '2011-02-12:99'}, response.json)
        self.assertEqual(201, response.status_code)

        response = self.client.post(
            '/events',
            json={
                'date': '2011-02-12',
                'event_type': 'tournament',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['a'],
                    },
                    {
                        'result': 2,
                        'squad': ['b', 'c'],
                    },
                ],
                'password': 'Good morning!',
            },
        )
        self.assertEqual(
            {'errors': 'Too many events within one day.'},
            response.json,
        )
        self.assertEqual(422, response.status_code)

    def test_invalid_password(self):
        response = self.client.post(
            '/events',
            json={
                'date': '2010-10-10',
                'event_type': 'match',
                'teams': [
                    {
                        'result': 1,
                        'squad': ['a'],
                    },
                    {
                        'result': 2,
                        'squad': ['b'],
                    },
                ],
                'password': 'Good evening!',
            },
        )

        self.assertEqual(
            {
                'errors': {'password': 'Invalid password'}
            },
            response.json,
        )
        self.assertEqual(422, response.status_code)


if __name__ == '__main__':
    unittest.main()
