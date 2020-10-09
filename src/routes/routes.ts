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

export default class Routes {
    public router: Router;
    private app;

    constructor(app: any, router: any) {
        this.app = app;
        this.setAllRoutes(router);
    }

    private setAllRoutes(router: any) {
        const baseRoute = '/api/vi';
        this.app.use(baseRoute, UserRouter);
        this.app.use(baseRoute, AuthRouter);
        this.app.use(baseRoute, ApiKeyRouter);
        this.app.use(baseRoute, AccountRouter);
        this.app.use(baseRoute, BillingRouter);
        this.app.use(baseRoute, GeoFenceRouter);
        this.app.use(baseRoute, ItemRouter);
        this.app.use(baseRoute, LocationRouter);
        this.app.use(baseRoute, SubscriptionRouter);
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
