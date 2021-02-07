# yarn start is the main command. Theoretically, the Dockerfile
# could end with `CMD yarn start`; however, in that case nginx
# is not started because when you do `docker build`, you just create
# an image. When the container is created from that image, none of
# the processes is running except for the one specified in
# `CMD` command. Since it's required to run both `nginx` and
# `yarn start`, they were moved out to the separate script
# which is executed during the container launch.
nginx
yarn --cwd /my_workdir_foosta_ui/react_app start
