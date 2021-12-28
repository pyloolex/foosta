import unittest

import mock
import psycopg2
from psycopg2 import extras

from foosta import app as endpoints


class BaseFoostaDbTest(unittest.TestCase):
    def setUp(self, *args, **kwargs):
        super().setUp(*args, **kwargs)

        connection, cursor = self.get_test_connection_and_cursor()
        self.db_connection = connection
        self.db_cursor = cursor
        self.clear_database()

    def tearDown(self, *args, **kwargs):
        self.clear_database()

        super().tearDown(*args, **kwargs)

    @staticmethod
    def get_test_connection_and_cursor():
        connection = psycopg2.connect(
            database="foostadb",
            user='foostauser',
            password='db-pass',
            host='localhost',
            port=5432,
        )
        cursor = connection.cursor(cursor_factory=extras.RealDictCursor)

        return connection, cursor

    def clear_database(self):
        self.db_cursor.execute('DELETE FROM "EventMeta"')
        self.db_cursor.execute('DELETE FROM "EventResult"')
        self.db_cursor.execute('DELETE FROM "EventSquad"')
        self.db_connection.commit()

    def add_event(self, data):
        endpoints.flatten_event_to_db(
            self.db_connection,
            self.db_cursor,
            data,
        )


class BaseFoostaApiTest(BaseFoostaDbTest):
    def setUp(self, *args, **kwargs):
        super().setUp(*args, **kwargs)

        self.db_patch = mock.patch(
            'foosta.util.connect_to_db',
            return_value=(self.db_connection, self.db_cursor),
        )
        self.db_patch.start()

        self.client = endpoints.app.test_client()

    def tearDown(self, *args, **kwargs):
        self.db_patch.stop()

        super().tearDown(*args, **kwargs)
