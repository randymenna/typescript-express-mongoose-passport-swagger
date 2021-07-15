import { Device } from 'src/api/device/device.model';

export const timedEventRequestMessageHandler = async (eventRequest: any, content: any, ackOrNack: Function) => {
    console.log(eventRequest);
    if (eventRequest.properties.featureType === 'gibiPosition') {
        try {
            const deviceId = eventRequest.properties.deviceId;
            const device = await Device.find({id: deviceId});
            // rabbitMQ.publish('processed', report);
        }
        catch (e) {
            console.log(e);
        }
    }
};
