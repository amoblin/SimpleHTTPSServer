#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author: amoblin <amoblin@gmail.com>
# file name: main.py
# create date: 2014-04-18 10:27:34
# This file is created from ~/.marboo/source/media/file_init/default.init.py
# 本文件由 ~/.marboo/source/media/file_init/default.init.py 复制而来

import os
import BaseHTTPServer, SimpleHTTPServer
import ssl

os.chdir("public")
httpd = BaseHTTPServer.HTTPServer(('', 4443), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='../server.cer', keyfile="../server.key", server_side=True)
httpd.serve_forever()
