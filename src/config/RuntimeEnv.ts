import { initLog } from 'src/logger/loggerService';

initLog();

export class RuntimeEnv {
    static setEnv() {
        process.env.DEPLOY = 'local';
        process.env.PORT = process.env.PORT || String(3020);
    }

    static checkEnvironment() {
        let retVal = true;
        if (!process.env.NODE_ENV) {
            console.error('NODE_ENV not set');
            retVal = false;
        }
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not set');
            retVal = false;
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not set');
            retVal = false;
        }
        if (!process.env.JWT_EXPIRATION) {
            console.error('JWT_EXPIRATION not set');
            retVal = false;
        }
        if (!process.env.GATEWAY_PORT) {
            console.error('GATEWAY_PORT not set');
            retVal = false;
        }
        if (!process.env.COOKIE_PASSWORD) {
            console.error('COOKIE_PASSWORD not set');
            retVal = false;
        }
        if (!process.env.ENCRYPTION_KEY) {
            console.error('ENCRYPTION_KEY not set');
            retVal = false;
        } else {
            const key = process.env.ENCRYPTION_KEY;
            if (key.length !== 32) {
                console.error('invalid ENCRYPTION_KEY, length must be 32');
                console.error('ENCRYPTION_KEY length: ', key.length);
                retVal = false;
            }
        }
        if (!process.env.IV) {
            console.error('IV not set');
            retVal = false;
        } else {
            const iv = process.env.IV;
            if (iv.length !== 16) {
                console.error('invalid IV, length must be 16');
                console.error('IV length: ', iv.length);
                retVal = false;
            }
        }
        return retVal;
    };
}
