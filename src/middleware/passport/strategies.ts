import passportLocal from 'passport-local';
import { BasicStrategy, DigestStrategy } from 'passport-http';
import passportHttpBearer from 'passport-http-bearer';
import { apiKeyInHeaderBodyQueryStrategy } from './strategies/apikeyInHeaderBodyQueryStrategy/apikeyHeaderBodyStrategy';

import { localLogin } from './strategies/localLogin';
import { basicAuthLogin } from './strategies/basicAuthLogin';
import { digestAuthLogin, validateCallback } from './strategies/digestAuthLogin';
import { bearerToken } from './strategies/bearerToken';

const LocalStrategy = passportLocal.Strategy;
const BearerStrategy = passportHttpBearer.Strategy;

export const localLoginStrategy = new LocalStrategy({usernameField: 'email', passwordField: 'password'},
                                                            localLogin);
export const basicAuthStrategy = new BasicStrategy(basicAuthLogin);
// @ts-ignore
export const digestAuthStrategy = new DigestStrategy({qop: 'auth'}, digestAuthLogin, validateCallback)
export const bearerTokenStrategy = new BearerStrategy(bearerToken);
export const localApiKeyInHeaderBodyQueryStrategy = apiKeyInHeaderBodyQueryStrategy;
