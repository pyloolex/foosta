from flask import jsonify
from flask import Flask
import sys
import psycopg2
from psycopg2 import extras
from flask import request

app = Flask(__name__)


# NOTE: I'm not sure it's the most reliable approach.
# Need to find a better way of accessing machine localhost.
DOCKER_HOST_GATEWAY_IP = "172.17.0.1"


@app.route('/', methods=['GET', 'POST'])
def blah():
    connection = psycopg2.connect(
        database="foostadb",
        user='foostauser',
        password='foostapassword',
        host=DOCKER_HOST_GATEWAY_IP,
        port=7100,
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

        return jsonify('Okay, got you, motherfucker'), 201


        #print(, file=sys.stderr)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7250)
