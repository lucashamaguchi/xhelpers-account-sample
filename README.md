# Sample - API - Account

## Check out the live examples:
 - [Todo Web with auth](https://account.hamaguchi.site) ([Backend](https://account.api.hamaguchi.site/documentation))

## Check out the front source:
  - [Todo Web with auth](https://github.com/lucashamaguchi/account-sample-web)

## Description

API - Stack:

- [Node.js](https://nodejs.org/).
- [TypeScript](https://www.typescriptlang.org/).
- [Mongoose](https://mongoosejs.com/).
- [Xhelpers-api 2.+](https://www.npmjs.com/package/xhelpers-api).
- [Docker](https://www.docker.com/).


## Installation

```bash
$ npm install
# windowsenv
$ npm install -g cross-env
```

## Configuration

API configuration on .env file.

DEVS: Create .env file on root folder.

```bash
# server params
HOST=localhost
PORT=3100
SSL=false
JWT_SECRET=fa85a8ea-9a47-11ea-bb37-0242ac130002
JWT_ISSUER=lucashamaguchi
JWT_EXPIRE=12h

# database
MONGODB_URI=mongodb+srv://....

FRONT_URL=http://....

# mailman
MAILMAN_API_URL=http://localhost:4000
MAILMAN_APP_KEY=fa85a8ea-9a47-11ea-bb37-0242ac130002

FILEUPLOAD_API_URL=http://localhost:5000
FILEUPLOAD_API_APP_KEY=fa85a8ea-9a47-11ea-bb37-0242ac130002


# sso
SSO_GOOGLE_CLIENT_ID=16......apps.googleusercontent.com
SSO_GOOGLE_CLIENT_SECRET=6C9....
SSO_GOOGLE_LOCATION=<ms url>
SSO_GOOGLE_CLIENT_PASSWORD=verylongsecret123-0242ac130002

SSO_FACEBOOK_CLIENT_ID=815.....
SSO_FACEBOOK_CLIENT_SECRET=65bd....
SSO_FACEBOOK_LOCATION=<ms url>
SSO_GOOGLE_CLIENT_PASSWORD=verylongsecret123-0242ac130002
```

## Running the app

```bash
# build tsc
$ npm run build

# development
$ npm run dev

# production
$ npm run start
```

#### Routes

```code
Starting Xhelpers Hapi server API
Settings API: Mongoose enabled;
🆙  Connected to mongodb: 5.9.15/mongodb://mongo:mongo@localhost:27018/apptest?authSource=admin
Settings API: Sequelize disabled;
Settings API: SSL disabled;
Settings API: AppKey disabled;
Settings API: JWT enabled;
Settings API: SSO enabled;
Settings API: SSO Github disabled;
Settings API: SSO Facebook enabled;
Settings API: SSO Google enabled;
====================================================================================================
🆙  Server api    : http://127.0.0.1:3000/
🆙  Server doc    : http://127.0.0.1:3000/documentation
🆙  Server status : http://127.0.0.1:3000/status
====================================================================================================
Routing table:
        🚧 * - 🔑       /api/sso/facebook
        🚧 * - 🔑       /api/sso/google
        🔎  get -       /documentation
        🔎  get -       /health
        🔎  get -       /status
        🔎  get -       /swagger.json
        🔎  get - 🔑    /api/account
        📄  post -      /api/account
        📄  post -      /api/auth
        📄  post -      /api/account/confirm-email
        📄  post -      /api/account/forgot-password
        📄  post -      /api/account/recover-account
        📝  patch - 🔑  /api/users
        📝  patch - 🔑  /api/account/{id}
====================================================================================================
```
