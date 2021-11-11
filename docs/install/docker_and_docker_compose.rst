####################################
Setting up Docker and docker-compose
####################################

Install Docker
**************

Install package

.. sourcecode:: bash

    sudo apt install docker.io -y

If you try to verify it by

.. sourcecode:: bash

    docker run hello-world

you will get an error

    docker: Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post http://%2Fvar%2Frun%2Fdocker.sock/v1.40/containers/create: dial unix /var/run/docker.sock: connect: permission denied.
    See 'docker run --help'.

The error message tells you that your current user can’t access the docker engine, because you’re lacking permissions to access the unix socket to communicate with the engine.

As a temporary solution, you can use sudo to run the failed command as root (e.g. sudo docker ps).
However it is recommended to fix the issue by adding the current user to the docker group:

.. sourcecode:: bash

    sudo usermod -a -G docker $USER

You need to reboot after that for the changes to apply.

After the reboot, try the command again

.. sourcecode:: bash

    docker run hello-world

Now it should succeed

    Unable to find image 'hello-world:latest' locally
    latest: Pulling from library/hello-world
    0e03bdcc26d7: Pull complete
    Digest: sha256:1a523af650137b8accdaed439c17d684df61ee4d74feac151b5b337bd29e7eec
    Status: Downloaded newer image for hello-world:latest

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
     1. The Docker client contacted the Docker daemon.
     2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
     3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
     4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.

    To try something more ambitious, you can run an Ubuntu container with:
     $ docker run -it ubuntu bash

    Share images, automate workflows, and more with a free Docker ID:
     https://hub.docker.com/

    For more examples and ideas, visit:
     https://docs.docker.com/get-started/


Install docker-compose
**********************

Just one command

.. sourcecode:: bash

    sudo apt install docker-compose -y

Verification is the following. The command

.. sourcecode:: bash

    docker-compose version

should return something similar to this:

    docker-compose version 1.25.0, build unknown

    docker-py version: 4.1.0

    CPython version: 3.8.5

    OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
