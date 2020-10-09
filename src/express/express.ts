import logger from 'morgan';
import cors from 'cors';
import { corsOptions } from 'src/config/serverConfig';
import { serve, setup } from 'swagger-ui-express';
import { swaggerDocument } from 'src/openApi/swagger';
import Routes from 'src/routes/routes';
import express from 'express';
import passport from 'passport';
import {
    basicAuthStrategy,
    bearerTokenStrategy,
    localApiKeyInHeaderBodyQueryStrategy,
    localLoginStrategy
} from 'src/middleware/passport/strategies';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ } from 'src/rabbitMQ';

import swaggerJSDoc from 'swagger-jsdoc';

// tslint:disable-next-line:class-name
class _Express {
    private expressWs: any;
    private router: any;

    // tslint:disable-next-line:no-shadowed-variable no-empty
    constructor() {
    }

    private _app: any;

    get app(): any {
        return this._app;
    }

    // tslint:disable-next-line:no-shadowed-variable
    public async boot() {
        const db = await connectToMongo();
        const connected = await connectToRabbitMQ();
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
}

export const Express = _Express;
