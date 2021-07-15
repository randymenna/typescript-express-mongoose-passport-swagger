import cluster from 'cluster';
import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ, rabbitMQ } from 'src/rabbitMQ';
import { timedEventRequestMessageHandler } from 'src/messageHandlers/timedEvents/timedEventRequestMessageHandler';
// tslint:disable-next-line:no-var-requires
const Agenda = require('agenda');
const PROCESSOR_WORKERS = 1;
let restart = false;

const run = async () => {
    let isRunning = false;
    const appName = (process.argv[1].split('/').pop()).split('.').shift();

    RuntimeEnv.setEnv();

    if (RuntimeEnv.checkEnvironment()) {
        try {
            const db = await connectToMongo();
            const connected = await connectToRabbitMQ();
            if (connected) {
                console.log('***Starting', appName);
                const agenda = new Agenda({db: {address: process.env.MONGO_URI}});
                rabbitMQ.subscribe('raw', timedEventRequestMessageHandler);
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
    for (let i = 0; i < PROCESSOR_WORKERS; ++i) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.error('Worker %d died :(', worker.id);
        cluster.fork();
    });

} else {
    console.log('child', cluster.worker.id);
    run().then(isRunning => {
        restart = isRunning;
        if (!isRunning) {
            process.exit();
        }
    });
}


