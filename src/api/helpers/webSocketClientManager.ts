const clientMap: { [key: string]: any } = {};

export const addClient = (id: string, ws: any) => {
    clientMap[id] = ws;
};

export const removeClient = (id: string) => {
    clientMap[id] = undefined;
};

export const getClient = (id: string) => {
    return clientMap[id];
};

export const send = (id: string, msg: any) => {
    const ws = clientMap[id];
    if (ws) {
        try {
            ws.send(msg);
        }
        catch (e) {
            removeClient(id);
        }
    }
};

