import { RabbitMQ } from 'src/rabbitMQ/RabbitMQ';
import { rabbitConfig } from 'src/rabbitMQ/rascalConfig';

export const rabbitMQ = new RabbitMQ(rabbitConfig);

export const connectToRabbitMQ = async () => {
    try {
        return await rabbitMQ.connect();
    }
    catch (e) {
        console.log('Failed to connect to RabbitMQ');
        console.log(e.message);
        return null;
    }
};


