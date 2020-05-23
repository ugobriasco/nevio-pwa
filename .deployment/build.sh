#!/usr/bin/env sh

set -x

# Cleanup
rm -rf ./dist

# Bundle client
npm run build
