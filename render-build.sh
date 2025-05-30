#!/user/bin/env bash
# exit on error
set -o errexit

# Install dependecies
npm install
# npm run build

PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
mkdir -p $PUPPETEER_CACHE_DIR

npx puppeteer browsers install chrome

if[[ ! -d $PUPPETEER_CACHE_DIR ]]; then
    echo "...Copying Puppeteer Cache from Build Cache"
    cp -R /opt/render/project/src/.cache/puppeteer/chrome/ $PUPPETEER_CACHE_DIR
else
    echo "...Storing Puppeteer Cache in Build Cache"
    cp -R $PUPPETEER_CACHE_DIR /opt/render/project/src/.cache/puppeteer/chrome/
fi