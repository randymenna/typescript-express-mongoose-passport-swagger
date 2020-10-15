import cluster from 'cluster';
import { Express } from 'src/express/express';
import { RuntimeEnv } from 'src/config/RuntimeEnv';

const REST_SERVER_WORKERS = 1;
let restart = false;

const run = async () => {
    let isRunning = false;
    const appName = (process.argv[1].split('/').pop()).split('.').shift();
    RuntimeEnv.setEnv();

    if (RuntimeEnv.checkEnvironment()) {
        console.log('booting', appName);
        const server = new Express();
        await server.boot();
        server.app.listen(process.env.PORT, () => {
            console.log('***', appName, 'listening on port:', process.env.PORT);
        });
        isRunning = true;
    } else {
        console.error('Bad Env', appName);
        isRunning = false;
    }
    return isRunning;
};

if (cluster.isMaster) {
    // Create a worker for each CPU
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < REST_SERVER_WORKERS; ++i) {
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

