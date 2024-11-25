if [ -z "$TAG_NAME" ]; then
  echo "Error: TAG_NAME is not set in the environment. Exiting."
  exit 1
fi

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "Error: SENTRY_AUTH_TOKEN is not set in the environment. Exiting."
  exit 1
fi

STRIPPED_TAG_NAME="${TAG_NAME#v}"

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
