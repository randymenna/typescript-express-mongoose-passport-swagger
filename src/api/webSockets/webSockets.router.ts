import { message } from './webSockets.controller';

const _routerFn = (router: any) => {
    router.ws('/message', message);
    return router;
};

export const WsRouterFn = _routerFn;
