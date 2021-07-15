import { addClient, getClient } from 'src/api/helpers/webSocketClientManager';

export const webSocketMessageHandler = (msg: string, req: any) => {
    const message = JSON.parse(msg);

    switch (message.type) {
        case 'login':
            addClient(message.id, req.ws);
            req.ws.send(JSON.stringify({status: 'ok'}));
            break;

        case 'echo':
            const ws = getClient(message.id);
            ws.send(JSON.stringify(message.body));
            break;
    }
};
