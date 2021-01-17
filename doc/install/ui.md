# Setting up React UI

## First launch
**If the directory with the application has already been created, skip this step.**

Install latest Nodejs (there are some problems installing react with an outdated version of nodejs). That's why you need the latest one. You can choose LTS (Recommended For Most Users).
Go to https://nodejs.org and check out the number of the LTS version. For example, if you see 14.15.4 LTS on the main page of the website, it means you need to install 14th version.
The installation is as follows:
```bash
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```

At the end of the script execution, you will see something similar to
```
## Run `sudo apt-get install -y nodejs` to install Node.js 14.x and npm
## You may also need development tools to build native addons:
     sudo apt-get install gcc g++ make
## To install the Yarn package manager, run:
     curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
     echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
     sudo apt-get update && sudo apt-get install yarn
```

It's a good instruction. Do it from the top to the bottom.


(or not? can i just install npm and that's it?)

After that, check out:
```bash
    node -v
```

You should see something like
```bash
    v14.19.0
```

Install React:
```bash
    sudo npm install -g create-react-app
```

Initialize new project:
```bash
    create-react-app my_react_ui
```



^^^^^^^^^ It doesn't work. Need to figure out why and fix the tutorial.
