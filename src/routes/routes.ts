import { Router, Request, Response, NextFunction } from 'express';
import { WsRouterFn } from '../api/webSockets/webSockets.router';
import { UserRouter } from '../api/user/user.router';
import { AuthRouter } from '../api/auth/auth.router';
import { ApiKeyRouter } from '../api/apiKey/apiKey.router';

export default class Routes {
    public router: Router;
    private app;

    constructor(app: any, router: any) {
        this.app = app;
        this.setAllRoutes(router);
    }

    private setAllRoutes(router: any) {
        this.app.use('/api/v1', UserRouter);
        this.app.use('/api/v1', AuthRouter);
        this.app.use('/api/v1', ApiKeyRouter);
        this.app.use('/ws', WsRouterFn(router));

        this.setMainRoute();
    }

    private setMainRoute() {
        this.app.route('/').get(this.index);
    }

    /**
     * Main route
     */
    private index(req: Request, res: Response, next: NextFunction) {
        res.json({
            message: 'Hello World!'
        });
    }

}
