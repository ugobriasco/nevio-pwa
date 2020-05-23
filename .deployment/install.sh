#!/usr/bin/env sh
set -x

cd $1 #pass the target directory as parameter
tar zxvf package.tgz -C .
