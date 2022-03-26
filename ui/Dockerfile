FROM ubuntu:20.04

# Install nodejs.
RUN apt-get update && apt-get install curl -y && curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install nodejs -y

# Install yarn.
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn -y

# Install my app.
WORKDIR /my_workdir_foosta_ui
COPY . /my_workdir_foosta_ui

# This optimizes the build for a production:
# - logging is kept to a minimum, essential level
# - more caching levels take place to optimize performance
ENV NODE_ENV production

# Eslint is needed only during development.
ENV DISABLE_ESLINT_PLUGIN true

RUN ["yarn", "--cwd", "/my_workdir_foosta_ui/react_app", "install", "--production"]
RUN ["yarn", "--cwd", "/my_workdir_foosta_ui/react_app", "build"]

# Update nginx configuration.
RUN apt-get update && apt-get install nginx -y
COPY nginx_foosta_ui.conf /etc/nginx/conf.d/
RUN cp -r /my_workdir_foosta_ui/react_app/build /usr/share/nginx/html/foosta

CMD ["nginx", "-g", "daemon off;"]
