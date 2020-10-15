import { RabbitMQ } from 'src/rabbitMQ/RabbitMQ';
import { rabbitConfig } from 'src/rabbitMQ/rascalConfig';

export const rabbitMQ = new RabbitMQ(rabbitConfig);

export const connectToRabbitMQ = async () => {
    try {
        return await rabbitMQ.connect();
    }
    catch (e) {
        console.error('Failed to connect to RabbitMQ');
        console.error(e.message);
        return null;
    }
};


