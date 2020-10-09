import * as net from 'net';
import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ, rabbitMQ } from 'src/rabbitMQ';

const onConnect = (socket: any) => {
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;
    const timeConnected = Date.now();

    socket.setEncoding('ascii');
    socket.setTimeout(120000);

    socket.on('data', (data: any) => {
        // do we have valid data and do we have more than one position
        const isLocation = data.indexOf('$LOC');
        const isBGIResponse = data.indexOf('$BGI');
        const isOTAResponse = data.indexOf('$OTA');
        const isSleepResponse = data.indexOf('$SLP');
        const isWakeResponse = data.indexOf('$WAKE');

        // if first is 0 we have at least one good position, otherwise just toss it
        if (isLocation === 0 ||
            isBGIResponse === 0 ||
            isOTAResponse === 0 ||
            isSleepResponse === 0 ||
            isWakeResponse === 0) {

            const payload: any = {
                type: 'gibi',
                raw: data
            };
            rabbitMQ.publish('raw', payload);
        } else {
            console.log('gateway(): Bad Data: ' + data);
        }
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.log('deviceGateway(): timeout: Bytes Read %s ; connect duration: %s , from %s:%s', socket.bytesRead, Date.now() - timeConnected, remoteAddress, remotePort);
        socket.destroy();
    });

    socket.on('error', (e: any) => {
        console.log('deviceGateway(): Error: ' + e);
        socket.destroy();
    });

    socket.on('close', () => {
        console.log('deviceGateway(): close: Bytes Read %s ; connect duration: %s , from %s:%s', socket.bytesRead, Date.now() - timeConnected, remoteAddress, remotePort);
        socket.destroy();
    });
};

const run = async () => {
    const appName = (process.argv[1].split('/').pop()).split('.').shift();
    RuntimeEnv.setEnv();
    if (RuntimeEnv.checkEnvironment()) {
        try {
            const db = await connectToMongo();
            const connected = await connectToRabbitMQ();
            if (connected) {
                console.log('***Starting', appName);
                net.createServer(onConnect).listen(process.env.GATEWAY_PORT);
                console.log('listening on', process.env.GATEWAY_PORT);
            } else {
                console.log('---Failed', appName);
            }
        }
        catch (e) {
            console.log('---Failed', appName);
            console.log(e);
            process.exit(2);
        }
    } else {
        console.log('---Bad Env', appName);
        process.exit(1);
    }
};

run();
