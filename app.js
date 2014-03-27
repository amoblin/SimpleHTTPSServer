#!/usr/bin/env node

var http = require('http');
var https = require('https');
var express = require('express');

// ssl
var fs = require('fs');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cer', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express()
app.use(express.static(__dirname + '/public'))

var httpServer = http.createServer(app);
httpServer.listen(2308);

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);

console.log('It works');
