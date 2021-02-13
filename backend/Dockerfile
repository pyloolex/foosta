FROM ubuntu:20.04

RUN apt-get update -y && apt-get install -y python3-pip python3-dev libpq-dev

WORKDIR /my_workdir_foosta

RUN pip3 install flask
RUN pip3 install psycopg2

COPY . /my_workdir_foosta

ENV PYTHONPATH="${PYTHONPATH}:/my_workdir_foosta/flask_app/"

ENTRYPOINT ["python3"]
CMD ["flask_app/foosta/app.py"]