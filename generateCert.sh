#!/bin/sh
# author: amoblin <amoblin@gmail.com>
# file name: generateCert.sh
# create date: 2014-03-27 14:50:35
# This file is created from ~/.marboo/source/media/file_init/default.init.sh
# 本文件由 ~/.marboo/source/media/file_init/default.init.sh　复制而来


domain="$1"

# CA
openssl genrsa -out customCA.key 2048

openssl req -x509 -new -key customCA.key -out customCA.cer -days 730 -subj /CN="My Custom CA"

# server
openssl genrsa -out server.key 2048

openssl req -new -out server.csr -key server.key -subj /CN=${domain}

openssl x509 -req -in server.csr -out server.cer -CAkey customCA.key -CA customCA.cer -days 365 -CAcreateserial -CAserial serial

# distribute customCA
mkdir public
cp customCA.cer public
