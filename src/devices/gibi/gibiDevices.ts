import * as turf from 'turf';

export const isValidGibiCommand = (cmd: string) => {
    return cmd.includes('$LOC') ||
        cmd.includes('$BGI') ||
        cmd.includes('$OTA') ||
        cmd.includes('$SLP') ||
        cmd.includes('$WAKE');
};

const data = [
    '$LOC: "BG",1,1602226961,+30.244225,-097.775946,0,000.000,000.000,5,15,300,00,1,T-Mobile,2,11;8901260761363838049',
    '$LOC: "BG",1,1602226973,+33.838438,-112.079441,0,000.000,000.000,6,15,2F8,01,1,AT&T,2,80;89011702272099365543',
];

export const gibiMessageToGeoJson = (cmd: string) => {
    let position = null;
    const rawMessage = cmd.split(':');
    if (rawMessage.length === 2) {
        position = build(rawMessage);
    } else {
        console.log('Gibi Device, bad command:', cmd);
    }
    return position;
};

const build = (rawMessage: string[]) => {
    const command = rawMessage[0];
    const fieldsAndDeviceId = rawMessage[1].split(';');
    const deviceId = fieldsAndDeviceId[1];
    const fields = fieldsAndDeviceId[0].split(',');

    const geoJsonPoint = messageFunctionMap[command](fields);
    geoJsonPoint.properties.deviceId = deviceId;
    geoJsonPoint.properties.rawData = rawMessage.join(':');
    geoJsonPoint.properties.receivedTime = new Date();

    return geoJsonPoint;
};

const parseLocation = (fields: string[]) => {
    // "BG",1,1602226961,+30.244225,-097.775946,0,000.000,000.000,5,15,300,00,1,T-Mobile,2,11;8901260761363838049'
    const deviceReport: any = {
        featureType: 'gibiPosition',
        status: parseInt(fields[1], 10),
        timeStamp: parseInt(fields[2], 10),
        latitude: parseFloat(fields[3]),
        longitude: parseFloat(fields[4]),
        altitude: parseFloat(fields[5]),
        speed: parseFloat(fields[6]),
        heading: parseFloat(fields[7]),
        accuracy: parseInt(fields[8], 10),
        ttf: parseInt(fields[9], 10),
        battery: fields[10],
        // batteryPctRemaining: batteryUtil.valueToPercent(fields[10]),
        chargerStatus: fields[11],
        chargingStatus: parseInt(fields[12], 10),
        mobileOperator: fields[13].trim(),
        // networkGen: getNetworkGen(fields[14]),
        rssi: parseInt(fields[15], 10),
    };

    const position = turf.point([parseFloat(fields[3]), parseFloat(fields[4])], deviceReport);
    return position;
};

const messageFunctionMap: { [key: string]: Function } = {
    '$LOC': parseLocation,
};
