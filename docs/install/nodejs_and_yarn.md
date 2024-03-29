# Installing NodeJS and Yarn

There are some problems installing `react` with an outdated version of `nodejs` - that's why you need the latest one. You are better to choose LTS (Recommended For Most Users).

Go to `https://nodejs.org` and check out the number of the LTS version. For example, if you see `16.13.2 LTS` on the main page of the website, it means you need to install 16th version.

You can also visit `https://github.com/nodesource/distributions/blob/master/README.md#deb`
to make sure the below command is really relevant.

The installation consists of two steps. The first one is to run a preparation script:
```bash
    curl -sLS https://deb.nodesource.com/setup_16.x | sudo -E bash -
```

At the end of the script execution, you will see something similar to:
```
## Run `sudo apt-get install -y nodejs` to install Node.js 16.x and npm
## You may also need development tools to build native addons:
     sudo apt-get install gcc g++ make
## To install the Yarn package manager, run:
     curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
     echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
     sudo apt-get update && sudo apt-get install yarn
```

It's a good instruction. Indeed, it's pretty difficult to launch react app without `yarn` (a lof of errors occur).
The first command to build native addons isn't needed. You just need to install `nodejs` itself and `yarn`.

Nodejs:
```bash
    sudo apt update && sudo apt install nodejs -y
```
Yarn:
```bash
    curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt update && sudo apt install yarn
```

Checkout that the node is installed and it's the latest version.
```bash
    node -v
    yarn -v
```