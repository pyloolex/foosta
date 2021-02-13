# Setting up React UI

## Deploying app with Docker

First of all, make sure that `package.json` and `yarn.lock` are present in the directory, `node_modules`, in contrast, isn't. If it is, remove it.

Go to `foosta/ui` and build a docker image:
```bash
    docker build -t foosta_ui_img:latest .
```

Launch docker container from that image:
```bash
    docker run -p 7300:7350 -d --restart always --name=foosta_ui foosta_ui_img
```



## Rebuilding a container

If you need to rebuild it with the new changes, do:
1. Repeat the "build" command: `docker build -t foosta_ui_img:latest .`
2. Stop an existing container: `docker container stop foosta_ui`
3. Remove an existing container: `docker container rm foosta_ui`
4. Run new container again: `docker run -p 7300:7350 -d --restart always --name=foosta_ui foosta_ui_img`



## Development process

Rebuilding an image and recreating a container after every change during development is too long. It makes sense to build a react app right in a VM, develep everything and only after that deploy a docker container.

In order to build it in a VM, you need to install NodeJS and Yarn ([tutorial](/doc/install/nodejs_and_yarn.md)).

Then navigate to `foosta/ui/react_app` and make sure that `package.json` and `yarn.lock` are present in the directory, `node_modules`, in contrast, isn't. If it is, remove it.

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

Put the `foosta/ui/foosta_dev_nginx.conf` into `/etc/nginx/conf.d/`:
```bash
    sudo cp foosta/ui/foosta_dev_nginx.conf /etc/nginx/conf.d/
```

Restart nginx:
```bash
    sudo systemctl restart nginx
```

And use `172.28.128.4:7350` as an entry point in the browser.



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