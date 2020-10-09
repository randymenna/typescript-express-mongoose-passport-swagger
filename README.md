# typescript-express-mongoose-passport-swagger-starter

This is an extension of the base starter to implement a location api / micro service position processing system

This branch switches to webpack for building, and outputs several node app/micro-services

This branch also move the environment from external files to webpack

Inherited from the base it has:

* Local user creation and authentication, which can easily be configured to substitue the use of 3rd party services.

It has passport support already implemented for:
* local authentication
* basic authentication
* digest authentication
* api key (header, query param or body param) authentication
* bearer token authentication

The authentication endpoints return a JWT token required for Bearer authentication.

## Prerequisites

Latest version of Node to be installed (developed on 12.14)

Install MongoDB and make sure it is running

Set NODE_ENV in your environment and
configure the appropriate section of the __webpack.config.js__ file for the 
connection to mongodb and other required variables.

## Required Environment Variables
    MONGO_URI = Mongodb connection url
    JWT_SECRET = Bearer token signing secret
    JWT_EXPIRATION = Bearer token life
    ENCRYPTION_KEY = Database encryption key (must be 32 chars)
    IV = Encryption initialization vector (must be 16 chars)
## NPM Commands
```bash
npm run build-ts        single compile of the source
npm run webpack-dev     starts webpack with --watch parameter, 
                        recompiles on every change
npm run serve           run the server
npm run watch-node      restart node app on changes
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
