#!/bin/bash

if [ -z "$1" ]; then
  echo "Error: TAG_NAME was not provided. Exiting."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Error: SENTRY_AUTH_TOKEN was not provided. Exiting."
  exit 1
fi

TAG_NAME="$1"
SENTRY_AUTH_TOKEN="$2"
STRIPPED_TAG_NAME="${TAG_NAME#v}"

# workaround for cloudbuild
export SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"

echo "Uploading source maps for release: $STRIPPED_TAG_NAME"
npx sentry-cli sourcemaps upload ./dist -o=lorel -p=fe --release="$STRIPPED_TAG_NAME"

if [ $? -ne 0 ]; then
  echo "Failed to upload source maps to Sentry."
  exit 1
fi

echo "Source maps uploaded successfully for release: $STRIPPED_TAG_NAME"

find ./dist -type f -name "*.map" -exec rm -f {} +

if [ $? -ne 0 ]; then
  echo "Failed to delete .map files."
  exit 1
fi
