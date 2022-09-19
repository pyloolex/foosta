>    "mini-css-extract-plugin": "2.4.5"

can be removed from `package.json` after upgrading to the next version of React.
It's a workaround for
https://github.com/facebook/create-react-app/issues/11930

when doing `yarn build`.

* * *

If VPS has 512MB of RAM, the swapfile of 1G is more than enough.
Foosta containers take 1.5-2G of disk space.


* * *
skyhost
Reset password through the website
Connect as root: ssh root@<ip>
sudo adduser admin
sudo adduser admin sudo
Login as admin: su - adminType sudo. Do you see an error "sudo: unable to resolve host foostahost: Name or service not known"?
Modify /etc/hosts. Add the following line
127.0.0.1 foostahostAdd the same line to /etc/hosts template: sudo nano /etc/cloud/templates/hosts.debian.tmplThen sudo apt update && sudo apt -y upgrade. If you are asked to update some files that were changed locally, always agree. Let's replace all the files with the new ones.
/etc/cloud/templates/hosts.debian.tmpl will be also rewritten, so add
127.0.0.1 foostahost
there again.df -h --total to see disk usage