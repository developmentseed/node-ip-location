# node-ip-location [![Build Status](https://travis-ci.org/jflasher/node-ip-location.svg)](https://travis-ci.org/jflasher/node-ip-location)

A small node application to provide an endpoint to get the caller's location. 

## Overview

I needed a way for a client-side application to get the user's rough location without 
going through the browser so I came up with this. It will check the incoming 
request for various parameters to try and come up with an IP address. It'll then 
call out to the [NetImpact](http://www.netimpact.com/) service to turn that IP 
into a general area. 

Note that this is completely dependent on NetImpact's service which is rate limited. 
You will need to provide your own API key and depending on usage, can quickly run 
through the allowed daily limit.

## Setting up your development environment
To set up the development environment for this app, you'll need to install the following on your system:

- [Node.js](http://nodejs.org/)

After these basic requirements are met, run the following commands in the root project folder:
```
$ npm install
```

You will need to set an environment variable for your API key or otherwise 
hardcode it.
```
API_KEY=foo
```

This application is designed to be run on Heroku (but can easily be changed to 
work elsewhere). As such, it may be worth installing the Heroku [toolbelt](https://toolbelt.heroku.com/).

## Running the app
First, you should run the tests to make sure things are working as expected.
```
$ npm test
```
If something is not working, create an Issue.

To start the app, run the following command in the root project folder.

```
$ npm start
```

or if using Heroku toolbelt:

```
$ foreman start
```

Serves the application at: `http://localhost:5000`

## Future improvements
This is a pretty simple utility so not a lot of things, but here is what I was 
thinking:

- Find a different way to handle IP -> location conversion, it'd be nice not 
to have to be dependent on a rate-limited service.
- Better handling of bad inputs, currently there are virtually none

## Known issues

## Contribution guidelines

There are many ways to contribute to a project, below are some examples:

- Report bugs, ideas, requests for features by creating “Issues” in the project repository.

- Fork the code and play with it, whether you later choose to make a pull request or not.

- Create pull requests of changes that you think are laudatory. From typos to major design flaws, you will find a target-rich environment for improvements.

### Style
There is no set style for this project, but please try to match existing coding 
styles as closely as possible.

### Tests
If you're going to add new features, please make sure they come along with 
tests to make sure everything works as expected. Outside small changes, Pull 
Requests will not be accepted without associated tests.