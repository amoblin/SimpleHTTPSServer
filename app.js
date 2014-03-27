#!/usr/bin/env node

var http = require('http');
var express = require('express');

var app = express()
app.use(express.static(__dirname + '/public'))

var httpServer = http.createServer(app);
httpServer.listen(2308);

console.log('It works');
