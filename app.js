#!/usr/bin/env node

var config = {
    "name": "English Mofunshow",
    "revision": "r741"
};

var http = require('http');
var https = require('https');
var express = require('express');

// ssl
var fs = require('fs');
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.cer', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = express();
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {pretty: true});

app.get('/', function(req, res) {
    res.render('index', config);
});

var httpServer = http.createServer(app);
httpServer.listen(2308);

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);

console.log('It works');
