# typescript-express-mongoose-passport-swagger-starter

This is a base API server, with mongoose and passport integrated in.
It has local user creation and authentication, which can easily be configured to substitue the use of 3rd party services.

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
configure the appropriate .env file for the 
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
npm run watch-ts        ts-watch starts the tsc (TypeScript compiler) with --watch parameter, 
                        recompiles on every change
npm run serve           run the server
npm run watch-node      restart node app on changes
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
