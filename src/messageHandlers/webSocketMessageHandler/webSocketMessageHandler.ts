import { addClient, getClient } from 'src/api/helpers/webSocketClientManager';

/**
 * @swagger
 *  components:
 *    schemas:
 *      webSocketMessage:
 *        type: object
 *        required:
 *          - type
 *          - id
 *          - body
 *        properties:
 *          type:
 *            type: string
 *          id:
 *            type: string
 *          body:
 *             type: string
 *             description: message type specific data
 */

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
