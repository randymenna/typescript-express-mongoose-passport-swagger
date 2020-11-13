import { Device } from 'src/api/device/device.model';

export const processRawGeoJson = async (geoPoint: any, content: any, ackOrNack: Function) => {
    console.log(geoPoint);
    if (geoPoint.properties.featureType === 'gibiPosition') {
        try {
            const deviceId = geoPoint.properties.deviceId;
            const device = await Device.find({id: deviceId});
            // rabbitMQ.publish('processed', report);
        }
        catch (e) {
            console.log(e);
        }
    }
};
