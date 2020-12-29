import { NextFunction, Request, Response, Router } from 'express';
import { WsRouterFn } from '../api/webSockets/webSockets.router';
import { UserRouter } from '../api/user/user.router';
import { AuthRouter } from '../api/auth/auth.router';
import { ApiKeyRouter } from '../api/auth/apiKey/apiKey.router';
import { AccountRouter } from 'src/api/account/account.router';
import { BillingRouter } from 'src/api/billing/billing.router';
import { GeoFenceRouter } from 'src/api/geoFence/geoFence.router';
import { ItemRouter } from 'src/api/item/item.router';
import { LocationRouter } from 'src/api/location/location.router';
import { SubscriptionRouter } from 'src/api/subscription/subscription.router';
import { baseApiUrl } from 'src/config/serverConfig';

export default class Routes {
    public router: Router;
    private app;

    constructor(app: any, router: any) {
        this.app = app;
        this.setAllRoutes(router);
    }

    private setAllRoutes(router: any) {
        this.app.use(baseApiUrl, UserRouter);
        this.app.use(baseApiUrl, AuthRouter);
        this.app.use(baseApiUrl, ApiKeyRouter);
        this.app.use(baseApiUrl, AccountRouter);
        this.app.use(baseApiUrl, BillingRouter);
        this.app.use(baseApiUrl, GeoFenceRouter);
        this.app.use(baseApiUrl, ItemRouter);
        this.app.use(baseApiUrl, LocationRouter);
        this.app.use(baseApiUrl, SubscriptionRouter);
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
