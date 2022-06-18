#!/usr/bin/env sh

cd src/

npm install --prefix roles-api
npm install --prefix authorizer
npm install --prefix apps-api
npm install --prefix authorizer-api
npm install --prefix layers/common/3rd-party/nodejs/node14

cd ../..