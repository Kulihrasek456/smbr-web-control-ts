# about
this repo is a complete rewrite of the original [web control system](https://github.com/TrendBit/SMBR-web-control).

It allows the user to setup experiments, view data etc. from a web dashboard.

___

# how to use
Since the server hosts a web dashboard, you only need to connect to it using your web browser. 

___

# how to host

## preparation

clone this repository into you desired directory
```bash
git clone #TODO when repo is created
```

if you don't have npm installed, you can install it with:
```bash
sudo apt-get install npm
```

if you use debian repositories, you will also need to install a newer version of node than the one provided. For that you can use n, nvm or any other node version manager.
Installing n and using it to install a newer version of node:
```bash
npm install -g n
n latest
```

then install all of the needed node modules:

```bash
npm run install:all
```

or

```bash
npm run ci:all
```

## building

If you want to just build the project for production, use:

```bash
npm run build
```

or, if you want to run it later on you local machine, use the following command, which will install the needed node modules into the created dist folder.

```bash
npm run build:installed
```

## running

> requires the project to be built, see previous chapter as a guide.

For starting the server, use:

```bash
npm run start
```


___

Used libraries, and their licenses can be viewed in dist/ folder after building the project, and should be bundled with it in production.

Some icons are from https://github.com/google/material-design-icons/ in the original, unchanged state.
