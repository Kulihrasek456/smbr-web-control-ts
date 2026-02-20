# about
this repo is a complete rewrite of the original [web control system](https://github.com/TrendBit/SMBR-web-control).

It allows the user to setup experiments, view data etc. from a web dashboard.

___

# how to use
Since the server hosts a web dashboard, you only need to connect to it using your web browser. 

___

# how to install
clone this repository into you desired directory
```
git clone #TODO when repo is created
```

if you don't have npm installed, you can install it with:

```
sudo apt-get install npm
sudo npm install -g n
sudo n latest
```

then install all of the needed node modules:
```
npm run install:all
```
___

# how to host

> __the server does not support the HTTPS protocol__

NPM will automatically compile the client and server typescript files, and host them as a NodeJS server.

to build and run the server, use: 
```
npm run start
```

If you just want to try it out and don't have a SMBR reactor, run the server in debug mode:
```
npm run start:debug
```

This will allow you to simulate a connected reactor using the debug menu.

___


Some icons are from https://github.com/google/material-design-icons/ in the original, unchanged state.
