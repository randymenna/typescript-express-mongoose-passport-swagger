import dotenv from 'dotenv';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import { corsOptions } from './config/serverConfig';
import { serve, setup } from 'swagger-ui-express';
import { swaggerDocument } from './openApi/swagger';
import Routes from './routes/routes';
import express from 'express';
import passport from 'passport';
import {
    basicAuthStrategy,
    bearerTokenStrategy,
    localApiKeyInHeaderBodyQueryStrategy,
    localLoginStrategy
} from './middleware/passport/strategies';

import swaggerJSDoc from 'swagger-jsdoc';

const envFile = 'src/.env';

// tslint:disable-next-line:class-name
class _Express {
    get app(): any {
        return this._app;
    }

    private _app: any;

    private expressWs: any;
    private router: any;

    // tslint:disable-next-line:no-shadowed-variable no-empty
    constructor() {
    }

    // tslint:disable-next-line:no-shadowed-variable
    public async boot() {
        await this.connectToMongo();
        this.getExpress();
        this.setMiddleware();
        this.setWebSocketServer();
        this.setPassport();
        this.setStaticFiles();
        this.setRoutes();
        this.setDocumenation();
    }

    private getExpress() {
        this._app = express();
    }

    static setEnv() {
        console.log('Loading environment:', process.env.NODE_ENV);
        let file = envFile;
        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
            file += '.' + process.env.NODE_ENV;
        }
        const env = path.join(__dirname, '../', file);
        const result = dotenv.config({
            path: env,
        });
    }

    private connectToMongo() {
        return new Promise((resolve, reject) => {
            mongoose.set('useNewUrlParser', true);
            mongoose.set('useFindAndModify', false);
            mongoose.set('useCreateIndex', true);
            mongoose.set('useUnifiedTopology', true);

            // Connect to mongo using mongoose
            mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const db = mongoose.connection;
            db.once('open', () => {
                console.log('Mongoose connected');
                resolve();
            });
            db.on('error', console.error.bind(console, 'conn error:'));
            db.on('error',  (err) => {
                console.log('Mongoose error', err);
                reject();
            });
        })
    }

    private setMiddleware() {
        this._app.use(cors(corsOptions));
        this._app.use(logger('dev'));
        this._app.use(express.json());
    }

    private setPassport() {
        this._app.use(passport.initialize());
        passport.use(localLoginStrategy);
        passport.use(basicAuthStrategy);
        passport.use(bearerTokenStrategy);
        passport.use('apiKey', localApiKeyInHeaderBodyQueryStrategy);
    }

    // tslint:disable-next-line:no-empty
    private setStaticFiles() {
    }

    /**
     * Set routes
     */
    private setRoutes() {
        const app = new Routes(this._app, this.router);
    }

    private setDocumenation() {
        const specs = swaggerJSDoc(swaggerDocument);
        this._app.use('/docs', serve, setup(specs, {explorer: true}));
    }

    private setWebSocketServer() {
        this.expressWs = require('express-ws')(this._app);
        this._app = this.expressWs.app;
        this.router = express.Router();
    }

    static checkEnvironment() {
        let retVal = true;
        if (!process.env.NODE_ENV) {
            console.error('NODE_ENV not set');
            retVal = false;
        }
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not set');
            retVal = false;
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not set');
            retVal = false;
        }
        if (!process.env.JWT_EXPIRATION) {
            console.error('JWT_EXPIRATION not set');
            retVal = false;
        }
        if (!process.env.ENCRYPTION_KEY) {
            console.error('ENCRYPTION_KEY not set');
            retVal = false;
        } else {
            const key = process.env.ENCRYPTION_KEY;
            if (key.length !== 32) {
                console.error('invalid ENCRYPTION_KEY, length must be 32');
                console.error('ENCRYPTION_KEY length: ', key.length);
                retVal = false;
            }
        }
        if (!process.env.IV) {
            console.error('IV not set');
            retVal = false;
        }  else {
            const iv = process.env.IV;
            if (iv.length !== 16) {
                console.error('invalid IV, length must be 16');
                console.error('IV length: ', iv.length);
                retVal = false;
            }
        }
        return retVal;
    };
}

export const Express = _Express;
