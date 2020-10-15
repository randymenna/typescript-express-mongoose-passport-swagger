import cluster from 'cluster';
import net from 'net';
import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ, rabbitMQ } from 'src/rabbitMQ';
import { isValidGibiCommand } from 'src/devices/gibiDevices';

const GATEWAY_WORKERS = 2;
const appName = (process.argv[1].split('/').pop()).split('.').shift();
let restart = false;

const onConnect = (socket: any) => {
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;
    const timeConnected = Date.now();

    socket.setEncoding('ascii');
    socket.setTimeout(120000);

    socket.on('data', (data: any) => {
        if (isValidGibiCommand(data)) {
            const payload: any = {
                type: 'gibi',
                raw: data
            };
            rabbitMQ.publish('raw', payload);
        } else {
            console.error('gateway(): Bad Data: ' + data);
        }
        socket.destroy();
    });

    socket.on('timeout', () => {
        console.error(appName, 'timeout: Bytes Read %s ; connect duration: %s , from %s:%s', socket.bytesRead, Date.now() - timeConnected, remoteAddress, remotePort);
        socket.destroy();
    });

    socket.on('error', (e: any) => {
        console.error(appName, 'Error: ' + e);
        socket.destroy();
    });

    socket.on('close', () => {
        console.error(appName, 'close: Bytes Read %s ; connect duration: %s , from %s:%s', socket.bytesRead, Date.now() - timeConnected, remoteAddress, remotePort);
        socket.destroy();
    });
};

const run = async () => {
    let isRunning = false;
    RuntimeEnv.setEnv();
    if (RuntimeEnv.checkEnvironment()) {
        try {
            const db = await connectToMongo();
            const connected = await connectToRabbitMQ();
            if (connected) {
                console.log('***Starting', appName);
                net.createServer(onConnect).listen(process.env.GATEWAY_PORT);
                console.log('listening on', process.env.GATEWAY_PORT);
                isRunning = true;
            } else {
                console.error('Failed', appName);
                isRunning = false;
            }
        }
        catch (e) {
            console.error('Failed', appName);
            console.error(e);
            isRunning = false;
        }
    } else {
        console.error('Bad Env', appName);
        isRunning = false;
    }
    return isRunning;
};

if (cluster.isMaster) {
    // Create a worker for each CPU
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < GATEWAY_WORKERS; ++i) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.error(`Worker %d died :(`, worker.id);
        if (restart) {
            cluster.fork();
        }
    });

} else {
    console.log('child', cluster.worker.id);
    process.env.CLUSTER_WORKER_ID = String(cluster.worker.id);
    run().then(isRunning => {
        restart = isRunning;
        if (!isRunning) {
            process.exit();
        }
    });
}

