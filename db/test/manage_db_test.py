import json
import os
import subprocess
import unittest


class ManageDbTest(unittest.TestCase):
    def setUp(self, *args, **kwargs):
        super().setUp(*args, **kwargs)
        self.clear_db()

    def tearDown(self, *args, **kwargs):
        self.clear_db()
        super().tearDown(*args, **kwargs)

    def clear_db(self):
        self.get_logs(['python3', 'db/manage_db.py', '--port=5432', 'clear'])

    @staticmethod
    def get_logs(cmd):
        with subprocess.Popen(
                cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE) as proc:
            stdout, stderr = proc.communicate()
        output = stdout + stderr
        return output

    def test_load_dump_clear(self):
        output = self.get_logs(
            ['python3', 'db/manage_db.py', '--port=5432',
             'load', 'db/test/test_sample.json'])
        self.assertEqual('OK\n', output.decode('UTF-8'))

        output = self.get_logs(
            ['python3', 'db/manage_db.py', '--port=5432',
             'dump', 'db/test/out'])
        self.assertEqual('OK\n', output.decode('UTF-8'))

        with open('db/test/out', encoding='UTF-8') as out:
            result = json.load(out)

        self.assertEqual(
            [
                {
                    "date": "2010-03-13",
                    "event_number": 0,
                    "event_type": "match",
                    "teams": [
                        {
                            "result": 8,
                            "squad": [
                                "Aaron",
                                "Brian"
                            ]
                        },
                        {
                            "result": 4,
                            "squad": [
                                "Charles"
                            ]
                        }
                    ]
                },
                {
                    "date": "2010-07-31",
                    "event_number": 0,
                    "event_type": "tournament",
                    "teams": [
                        {
                            "result": 2,
                            "squad": [
                                "Aaron",
                                "Ben"
                            ]
                        },
                        {
                            "result": 1,
                            "squad": [
                                "Brian",
                                "Charles"
                            ]
                        },
                        {
                            "result": 3,
                            "squad": [
                                "Dave",
                                "Erick",
                                "Frank"
                            ]
                        }
                    ]
                }
            ],
            result,
        )

        output = self.get_logs(
            ['python3', 'db/manage_db.py', '--port=5432', 'clear'])
        self.assertEqual('OK\n', output.decode('UTF-8'))

        output = self.get_logs(
            ['python3', 'db/manage_db.py', '--port=5432',
             'dump', 'db/test/out'])
        self.assertEqual('OK\n', output.decode('UTF-8'))

        with open('db/test/out', encoding='UTF-8') as out:
            result = json.load(out)

        self.assertCountEqual([], result)

        os.remove('db/test/out')


if __name__ == '__main__':
    unittest.main()
