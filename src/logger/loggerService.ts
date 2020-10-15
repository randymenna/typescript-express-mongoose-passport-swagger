import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

const appName = (process.argv[1].split('/').pop()).split('.').shift();

export const logger = createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY/MM/DD HH:mm:ss'}),
        format.printf(info => `[${info.timestamp}|${appName}|${process.env.CLUSTER_WORKER_ID}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.timestamp({format: 'HH:mm:ss'}),
                format.printf(info => `[${info.timestamp}|${process.env.CLUSTER_WORKER_ID}] ${info.level}: ${info.message}`)
            )
        }),
        // new transports.Stream({
        //     stream: fs.createWriteStream(path.resolve('logs', `${appName}.log`))
        // }),
        new transports.DailyRotateFile({
            filename: `${appName}.log`,
            dirname: path.resolve('logs'),
            handleExceptions: true,
            json: false,
            maxFiles: '30d'
        })
    ]
});

export const initLog = () => {
    console.log = (...args) => logger.info.call(logger, ...args);
    console.info = (...args) => logger.info.call(logger, ...args);
    console.warn = (...args) => logger.warn.call(logger, ...args);
    console.error = (...args) => logger.error.call(logger, ...args);
    console.debug = (...args) => logger.debug.call(logger, ...args);
};

