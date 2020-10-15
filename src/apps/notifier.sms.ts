import cluster from 'cluster';
import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ } from 'src/rabbitMQ';

const NOTIFIER_WORKERS = 1;
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
                isRunning = true;
            } else {
                console.log('Failed', appName);
                isRunning = false;
            }
        }
        catch (e) {
            console.log('---Failed', appName);
            console.log(e);
            isRunning = false;
        }
    } else {
        console.log('---Bad Env', appName);
        isRunning = false;
    }
    return isRunning;
};

if (cluster.isMaster) {
    // Create a worker for each CPU
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < NOTIFIER_WORKERS; ++i) {
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

