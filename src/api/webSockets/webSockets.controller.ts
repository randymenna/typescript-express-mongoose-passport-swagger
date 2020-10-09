import { webSocketMessageHandler } from 'src/messageHandlers/webSocketMessageHandler/webSocketMessageHandler';

export const message = (ws: any, req: any) => {
    ws.on('message', (msg: any) => {
        webSocketMessageHandler(msg, req);
    });
};
