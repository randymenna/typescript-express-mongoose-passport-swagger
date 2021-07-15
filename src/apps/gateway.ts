import cluster from 'cluster';
import net from 'net';
import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ, rabbitMQ } from 'src/rabbitMQ';
import { buildMessage, isGeoJson } from 'src/devices/gibi/gibiDevices';
import { Point } from 'src/api/point/point.model';

const GATEWAY_WORKERS = 1;
const appName = (process.argv[1].split('/').pop()).split('.').shift();
let restart = false;
let db = null;

const onConnect = (socket: any) => {
    const remoteAddress = socket.remoteAddress;
    const remotePort = socket.remotePort;
    const timeConnected = Date.now();

    socket.setEncoding('ascii');
    socket.setTimeout(120000);

    socket.on('data', async (data: any) => {
        try {
            console.log(data);
            if (process.env.QUEUE_AT_GATEWAY) {
                rabbitMQ.publish('raw', data);
            }
            if (process.env.PERSIST_AT_GATEWAY) {
                let gibiMessage = buildMessage(data);
                if (gibiMessage) {
                    if (isGeoJson(gibiMessage)) {
                        // save to mongo
                        const doc = await Point.create(gibiMessage);
                        gibiMessage = doc.toObject();
                    }
                    rabbitMQ.publish('process', gibiMessage);
                } else {
                    console.error('gateway(): Bad Data: ' + data);
                }
            }
        }
        catch (e) {
            console.error('gateway():', e);
        }
        finally {
            socket.destroy();
        }
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
            db = await connectToMongo();
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

