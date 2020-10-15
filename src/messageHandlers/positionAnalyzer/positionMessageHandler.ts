import { rawMessageToGeoJson } from 'src/devices/gibiDevices';
import { Positions } from 'src/mongoose/mongoose';

export const processRawLocations = async (message: any, content: any, ackOrNack: Function) => {
    console.log(message);
    if (message.type === 'gibi') {
        try {
            const point = rawMessageToGeoJson(message.data);
            const position = new Positions({...point});
            await position.save();
            // rabbitMQ.publish('processed', report);
        }
        catch (e) {
            console.log(e);
        }
    }
};
