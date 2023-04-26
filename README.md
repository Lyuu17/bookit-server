# BookIt Server

## Description

bookit-server is a travel agency API backend

## Installation

```bash
$ npm install
```

## Environment Variables

```properties
# Environment used. Use 'dev' to populate the db with default data
DEV_ENV=dev
# Port to be used
PORT=3005
# MongoDB URI
MONGODB_URI=mongodb://mongouser:mongopassword@127.0.0.1
# JWT Secret for auth. It can be generated on https://jwt.io/ site
JWT_SECRET=
# Geocode provider
GEOCODE_PROVIDER=openstreetmap
# Static folder where to the SPA
STATIC_DIR=../client/dist
# Public folder where static assets are saved
PUBLIC_DIR=public/
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```