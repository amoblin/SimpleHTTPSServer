#!/usr/bin/env node

var config = {
    "name": "English Mofunshow",
    "title": "英语魔方秀内测版",
    "revision": "r741",
    "root": "https://www.domain.name:4443/",
    "httpRoot": "https://www.domain.name:4443/http/"
};

var http = require('http');
var https = require('https');
var express = require('express');
var semver = require('semver');
var path = require('path');

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

var getClientInfo = function(req) {
    var ua = req.headers['user-agent'],
    $ = {};
    if (/mobile/i.test(ua))
	$.Mobile = true;
    if (/like Mac OS X/.test(ua)) {
	$.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
	$.iPhone = /iPhone/.test(ua);
	$.iPad = /iPad/.test(ua);
    }
    if (/Android/.test(ua))
	$.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
    if (/webOS\//.test(ua))
	$.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];
    if (/(Intel|PPC) Mac OS X/.test(ua))
	$.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;
    if (/Windows NT/.test(ua))
	$.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];
    return $;
}

app.get('/', function(req, res) {
    var iosVersion = getClientInfo(req).iOS || "7.1";
    if (iosVersion.length == 3) {
	iosVersion += ".0";
    }
    config.version = semver.gte(iosVersion, '7.1.0');
    if (config.version) {
	config.plists = getPlists("public");
	config.urlRoot = config.root
    } else {
	config.plists = getPlists("public/http");
	config.urlRoot = config.httpRoot
    }
    res.render('index', config);
});

var getPlists = function(dir) {
    var fs = require('fs');
    var files = [];
    fs.readdirSync(dir).forEach(function(item) {
	if (path.extname(item) == ".plist") {
	    files.push(path.basename(item, ".plist"));
	}
    });
    return files;
}

var httpServer = http.createServer(app);
httpServer.listen(2308);

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4443);

console.log('It works');
