export const echo = (ws: any, req: any) => {
    ws.on('message', (msg: any) => {
        ws.send(msg);
    });
}

export const update = (ws: any, req: any) => {
    ws.on('message', (msg: any) => {
        console.log(req);
        ws.send(req.params.id);
    });
}
