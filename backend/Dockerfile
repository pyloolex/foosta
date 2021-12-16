FROM ubuntu:20.04

RUN apt-get update -y && apt-get install -y python3-pip python3-dev libpq-dev

WORKDIR /my_workdir_foosta
COPY . /my_workdir_foosta

RUN pip3 install -r requirements.txt

# Update nginx configuration.
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install nginx -y

COPY foosta_nginx_backend.conf /etc/nginx/conf.d/

CMD ["bash", "start.sh"]
