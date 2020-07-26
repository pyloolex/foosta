from flask import jsonify
from flask import Flask
import sys
import psycopg2
from psycopg2 import extras
from flask import request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def blah():
    connection = psycopg2.connect(
        database="foostadb",
        user='foostauser',
        password='foostauser',
        host="localhost",
        port=5432,
    )
    cursor = connection.cursor(cursor_factory=extras.RealDictCursor)
    if request.method == 'GET':
        cursor.execute("select * from users")
        data = cursor.fetchall()

        return jsonify({'items': data})
    elif request.method == 'POST':
        data = {
            'salary': 100,
            'married': False,
        }
        payload = request.get_json()
        if 'username' not in payload:
            return "'username' must be specified", 422

        for field in payload:
            data[field] = payload[field]

        cursor.execute(
            "insert into users (username, salary, married) "
            "values ('{username}', {salary}, {married})".format(
                username=data['username'],
                salary=data['salary'],
                married=data['married'],
            )
        )
        connection.commit()

        return 'Okay, got you, motherfucker.\n', 201


        #print(, file=sys.stderr)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
