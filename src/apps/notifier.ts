import { RuntimeEnv } from 'src/config/RuntimeEnv';
import { connectToMongo } from 'src/mongoose/mongoose';
import { connectToRabbitMQ } from 'src/rabbitMQ';

const run = async () => {
    const appName = (process.argv[1].split('/').pop()).split('.').shift();
    RuntimeEnv.setEnv();
    if (RuntimeEnv.checkEnvironment()) {
        try {
            const db = await connectToMongo();
            const connected = await connectToRabbitMQ();
            if (connected) {
                console.log('***Starting', appName);
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
