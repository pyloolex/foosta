# Setting up React UI

## Deploying app with Docker

First of all, make sure that `package.json` and `yarn.lock` are present in the directory, `node_modules`, in contrast, isn't. If it is, remove it.
(Only the `package.json` is mandatory. `yarn.lock` doesn't need to be removed. But if there is no `yarn.lock`, it's not a problem.)

Go to `foosta/ui` and build a docker image:
```bash
    cd foosta/ui
    docker build -t foosta_ui_img:latest .
```

Launch docker container from that image:
```bash
    docker run -p 7300:7350 -d --restart always --name=foosta_ui foosta_ui_img
```

Now the website should be available on 172.28.128.4:7300 in your browser on the host.



## Rebuilding a container

If you need to rebuild it with the new changes, do:
1. Repeat the "build" command: `docker build -t foosta_ui_img:latest .`
2. Stop an existing container: `docker container stop foosta_ui`
3. Remove an existing container: `docker container rm foosta_ui`
4. Run new container again: `docker run -p 7300:7350 -d --restart always --name=foosta_ui foosta_ui_img`



## Development process
### Rebuilding an image every time
Do once
```bash
    docker container stop foosta_ui
```

Then use this command
```bash
    docker build -t foosta_ui_img:latest . && docker container rm foosta_ui && docker run -p 7300:7350 --name=foosta_ui foosta_ui_img
```

Ctrl+C might not help to stop the process. Then use
```bash
    docker container stop foosta_ui
```
in a separate terminal.



### Building locally

Rebuilding an image and recreating a container after every change during development is too long. It makes sense to build a react app right in a VM, develep everything and only after that deploy a docker container.

In order to build it in a VM, you need to install NodeJS and Yarn ([tutorial](/doc/install/nodejs_and_yarn.md)).

Then navigate to `foosta/ui/react_app` and make sure that `package.json` and `yarn.lock` are present in the directory, `node_modules`, in contrast, isn't. If it is, remove it.
(Only the `package.json` is mandatory. `yarn.lock` doesn't need to be removed. But if there is no `yarn.lock`, it's not a problem.)

Then run:
```bash
    yarn install
```

After it's done, you can start a development server:
```bash
    yarn start
```

All the changes are automatically handled without restarting a server. However, since you modify files on the host and the server is launched in the VM, you have to `touch` files that you modified in the VM so that the development server could see that something has changed and refresh automatically.

That is, after you modify some file on the host, do
```bash
    find ui/react_app/src/ -type f -exec touch {} +
```
inside the VM and you **don't** have to restart the server.

UI makes HTTP requests to backend which listens on another port. So that everything works properly, you need to add `nginx` config.

Install nginx:
```bash
    sudo apt install -y nginx
```

Put the `foosta/ui/nginx_foosta_ui_dev.conf` into `/etc/nginx/conf.d/`:
```bash
    sudo cp foosta/ui/nginx_foosta_ui_dev.conf /etc/nginx/conf.d/
```

Restart nginx:
```bash
    sudo systemctl restart nginx
```

And use `172.28.128.4:7350` as an entry point in the browser.

If ESlint is too annoying, it can be disabled by adding `DISABLE_ESLINT_PLUGIN=true` like this:
```bash
    DISABLE_ESLINT_PLUGIN=true yarn --cwd=/vagrant/ui/react_app/ start
```



## Creating new app

First, you need to install NodeJS and Yarn ([tutorial](/doc/install/nodejs_and_yarn.md)).

Then you can initialize react app:
```bash
    npx create-react-app foosta_react
```

Verify that it works by typing:
```bash
    cd foosta_react
    yarn start
```
and checking out `172.28.128.4:3000` in a browser.

You might also need to install `react-router-dom`:
```bash
    yarn add react-router-dom
```

And install `eslint`:
```bash
    yarn add eslint --dev
```

`--dev` means it's needed only for development. When you deploy your app, `eslint` won't be a dependency.

Create new ESlint config:
```bash
    yarn create @eslint/config
```

Choose the following:
```
    - How would you like to use ESLint?
    To check syntax, find problems, and enforce code style

    - What type of modules does your project use?
    JavaScript modules (import/export)

    - Which framework does your project use?
    React

    - Does your project use TypeScript?
    No

    - Where does your code run?
    Browser

    - How would you like to define a style for your project?
    Use a popular style guide

    - Which style guide do you want to follow?
    Google: https://github.com/google/eslint-config-google

    - What format do you want your config file to be in?
    JSON

    - The config that you've selected requires the following dependencies:
      eslint-plugin-react@latest eslint-config-google@latest eslint@>=5.16.0
      ? Would you like to install them now with npm?
    No
```

After that, install `eslint-plugin-react@latest` and `eslint-config-google@latest`:
```bash
    yarn add --dev eslint-plugin-react@latest eslint-config-google@latest
```

Now enforce Allman style in ESlint config. Add the following rule under the `rules` key:
```json
    "brace-style": ["error", "allman", { "allowSingleLine": true }]
```

Now you can run ESlint:
```bash
    yarn run eslint src/components/Teammates.jsx
```

If you see the warning
```
    Warning: React version not specified in eslint-plugin-react settings.
```

Add the following to the ESlint config:
```json
    "settings": {
      "react": {
        "version": "detect"
    }
```


## Upgrading React
Upgrading NodeJS and Yarn is easy. You just do the same that you did when installing them for the first time.

Official guide: https://create-react-app.dev/docs/updating-to-new-releases/

> When you run npx create-react-app my-app it automatically installs the latest version of Create React App.

After you upgraded NodeJS, create new React app somewhere.
```bash
    npx create-react-app myapp
```

Open generated `package.json` and compare it to what you had in Foosta's `package.json`. The only interesting section is the `dependencies`.

If you want to have everything latest, you need to set the same versions in you Foosta's `package.json` as in the newly generated app.
Since Foosta has additional packages, the new app `dependencies` collection has fewer items. Install everything missing through `yarn add` so that the `dependencies` collections in `myapp` and Foosta's `package.json` contain the same number of items.
For example,
```bash
    yarn add react-router-dom
```

Now set latest versions in your Foosta's `package.json`.

Then remove `node_modules` directory. (You don't need to remove `yarn.lock`)

Then run
```bash
    yarn install
```