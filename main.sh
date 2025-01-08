#!/bin/bash -xe

SCRIPT_DIR=$(cd $(dirname $0); pwd)
cd ${SCRIPT_DIR}


TARGET_GIT_REPOSITORY_PATH="./youtube-find"
TARGET_GIT_REPOSITORY_URL="git@github.com:iwakiridrcm/youtube-find.git"

if [ ! -d ${TARGET_GIT_REPOSITORY_PATH} ]; then
    git clone ${TARGET_GIT_REPOSITORY_URL} ${TARGET_GIT_REPOSITORY_PATH}
fi

cd ${TARGET_GIT_REPOSITORY_PATH}
git pull origin main
cd ${SCRIPT_DIR}

npm install
npm run build
