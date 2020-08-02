import sys
import psycopg2
from psycopg2 import extras


def print_usernames(cursor):
    cursor.execute("select * from users")
    data = cursor.fetchall()
    names = [item['username'] for item in data]
    print(len(names), names)


def main():
    connection = psycopg2.connect(
        database="foostadb",
        user='foostauser',
        password='foostapassword',
        host="localhost",
        port=7001,
    )
    cursor = connection.cursor(cursor_factory=extras.RealDictCursor)
    print_usernames(cursor)

    data = {
        'username': 'patrick',
        'salary': 100,
        'married': False,
    }
    cursor.execute(
        "insert into users (username, salary, married) "
        "values ('{username}', {salary}, {married})".format(
            username=data['username'],
            salary=data['salary'],
            married=data['married'],
        )
    )
    connection.commit()
    print_usernames(cursor)


if __name__ == '__main__':
    main()
