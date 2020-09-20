import { echo, update } from './webSockets.controller';

const _routerFn = (router: any) => {
    // @ts-ignore
    router.ws('/echo', echo);
    router.ws('/update/:id', update);
    return router;
}

export const WsRouterFn = _routerFn;
