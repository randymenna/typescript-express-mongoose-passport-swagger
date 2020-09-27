import dotenv from 'dotenv';
import path from 'path';
import { Express } from './express';

dotenv.config({
    path: path.join(__dirname, '../.env'),
});
const PORT = process.env.PORT || 3020;

const run = async () => {
    Express.setEnv();
    if (Express.checkEnvironment()) {
        const server = new Express();
        await server.boot();
        server.app.listen(PORT, () => {
            console.log('Server is listening on Port:', PORT);
        });
    } else {
        process.exit(1);
    }
};

run();

