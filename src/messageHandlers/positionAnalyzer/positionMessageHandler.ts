import { rabbitMQ } from 'src/rabbitMQ';

export const processRawLocations = (message: any, content: any, ackOrNack: Function) => {
    console.log(message);
    rabbitMQ.publish('processed', message);
};
