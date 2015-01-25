'use strict';

require('newrelic');
var http = require('http');
var request = require('request');

var port = process.env.PORT || 5000;

var getLocation = function (ip, callback) {
  // Make sure we have an IP to check
  if (!ip || ip === '') {
    return callback('{ error: "No IP address found" }');
  }

  var apiKey = process.env.API_KEY || 'key';
  var url = 'http://api.netimpact.com/qv1.php?key=' +
              apiKey + '&qt=geoip&d=json&q=' + ip;

  request.get(url, function (err, response, body) {
    if (err) { 
      return callback(err);
    }

    callback(null, body);
  });
};
module.exports = getLocation;

http.createServer(function (req, res) {
  if(req.url === '/location') {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

    if (ip === undefined) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end('{ error: "No IP address found" }');
    }

    getLocation(ip, function (err, json) {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With'
      });

      if (err) {
        console.log(err);
        return res.end(err);
      }

      var parsed;
      try {
        parsed = JSON.parse(json);
      }
      catch (e) {
        return res.end('{ error: "Error parsing Address server data." }');
      }

      // Check for max connections case
      if (parsed === 'MSG: MAX CONNECTIONS REACHED') {
        return res.end('{ error: "Ruh roh, over API limit." }'); 
      }

      var data = {
        location : {
          lat: parsed[0][4],
          lon: parsed[0][5]
        }
      };
      res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('nothing to see here\n');  
  }
}).listen(port);