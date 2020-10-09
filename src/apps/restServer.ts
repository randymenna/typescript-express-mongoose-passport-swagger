import * as cluster from 'cluster';
import { Express } from 'src/express/express';
import { RuntimeEnv } from 'src/config/RuntimeEnv';

const REST_SERVER_WORKERS = 2;

const run = async () => {
    const appName = (process.argv[1].split('/').pop()).split('.').shift();
    RuntimeEnv.setEnv();
    if (RuntimeEnv.checkEnvironment()) {
        console.log('booting', appName);
        const server = new Express();
        await server.boot();
        server.app.listen(process.env.PORT, () => {
            console.log('***', appName, 'listening on port:', process.env.PORT);
        });
    } else {
        console.log('---Bad Env', appName);
        process.exit(1);
    }
};

if (cluster.isMaster) {
    // Create a worker for each CPU
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < REST_SERVER_WORKERS; ++i) {
        cluster.fork();
    }

    // cluster.on('exit', (worker) => {
    //     console.log('Worker %d died :(', worker.id);
    //     cluster.fork();
    // });

} else {
    console.log('child', cluster.worker.id);
    run();
}

