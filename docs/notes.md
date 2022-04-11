>    "mini-css-extract-plugin": "2.4.5"

can be removed from `package.json` after upgrading to the next version of React.
It's a workaround for
https://github.com/facebook/create-react-app/issues/11930

when doing `yarn build`.

* * *

If VPS has 512MB of RAM, the swapfile of 1G is more than enough.
Foosta containers take 1.5-2G of disk space.