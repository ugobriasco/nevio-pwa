#!/usr/bin/env sh

set -x
echo 'Deploying application';

# Load configurations
. ./.deployment/config.sh;

# Build the project
sh ./.deployment/build.sh

# Prepare tar ball, send it to the host server and install the application
tar -czf package.tgz dist && \
scp package.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./.deployment/install.sh $REMOTE_APP_DIR

# Cleanup
rm -rf dist;
rm package.tgz

echo 'Done';
