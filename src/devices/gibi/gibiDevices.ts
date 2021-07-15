import * as turf from 'turf';
import {
    GibiMessageType,
    IGibiIntervalResponseMessage,
    IGibiLocationMessage,
    IGibiOtaResponseMessage,
    IGibiSleepResponse,
    IGibiWakeResponse
} from 'src/devices/gibi/gibiInterfaces';

// $BGI:<status>,<setting>,<response id>;<device id>
// $OTA:<status>,<requestId>,<TimeStamp>;<DeviceID>
// $SLP:<request id>
// $WAKE:<reason>,<request id>
// $LOC:<BG|PU|PD|FC|BA|FIND|>

const sampleData = [
    '$LOC: "BG",1,1602226961,+30.244225,-097.775946,0,000.000,000.000,5,15,300,00,1,T-Mobile,2,11;8901260761363838049',
    '$LOC: "BG",1,1602226973,+33.838438,-112.079441,0,000.000,000.000,6,15,2F8,01,1,AT&T,2,80;89011702272099365543',
    '$BGI:1,10,3d998e75-fa19-6c44-03a7-b84022e1cf52;89011702278175710353',
    '$SLP:Z1bBT5Bn9I;89011702272099366277',
    '$WAKE:1,bkpxW9r25I;89011702272099366277',
];

export const isValidGibiCommand = (cmd: string) => {
    return cmd.startsWith('$LOC') ||
        cmd.startsWith('$BGI') ||
        cmd.startsWith('$OTA') ||
        cmd.startsWith('$SLP') ||
        cmd.startsWith('$WAKE');
};

const commandType = (cmd: string) => {
    if (cmd.includes('$LOC')) {
        const subCommand = cmd.split(':')[1].split(',')[0];
        switch (subCommand) {
            case 'BG':
                return GibiMessageType.BACKGROUND_LOCATION;
            case 'PU':
                return GibiMessageType.POWER_UP;
            case 'PD':
                return GibiMessageType.POWER_DOWN;
            case 'FC':
                return GibiMessageType.FULL_CHAGE;
            case 'LB':
                return GibiMessageType.BATTERY_ALERT;
            case 'FIND':
                return GibiMessageType.FIND;
            default:
                return GibiMessageType.UNKNOWN;
        }
    } else if (cmd.includes('$BGI')) {
        return GibiMessageType.BACKGROUND_INTERVAL;
    } else if (cmd.includes('$OTA')) {
        return GibiMessageType.OTA_UPGRADE;
    } else if (cmd.includes('$SLP')) {
        return GibiMessageType.SLEEP_RESPONSE;
    } else if (cmd.includes('$WAKE')) {
        return GibiMessageType.WAKE_RESPONSE;
    }
};

export const isLocationCommand = (cmd: string) => cmd.startsWith('$LOC');

export const gibiMessageToGeoJson = (coords: number[], message: any) => {
    const position = turf.point(coords, message);
    return position;
};

export const isGeoJson = (msg: any) => {
    return msg.type === 'Feature';
};

export const buildMessage = (rawMessage: string) => {
    if (isValidGibiCommand(rawMessage)) {
        const fieldsAndDeviceId = rawMessage.split(':')[1].split(';');
        const fields = fieldsAndDeviceId[0].split(',');
        const type = commandType(rawMessage);

        const message = {
            commandType: type,
            deviceId: fieldsAndDeviceId[1],
            data: messageFunctionMap[type](fields),
            receivedTime: new Date(),
            rawMessage,
        };
        if (isLocationCommand(rawMessage)) {
            message.data.deviceId = message.deviceId;
            message.data.receivedTime = message.receivedTime;
            return gibiMessageToGeoJson([message.data.latitude, message.data.longitude], message.data);
        }
        return message;
    }
    return null;
};

const parseLocation = (fields: string[]) => {
    // @ts-ignore
    const deviceReport: IGibiLocationMessage = {
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
    return deviceReport;
};

const parseIntervalResponse = (fields: string[]) => {
    const fieldOneSplit = fields[0].split(':');
    const regex = new RegExp('"', 'g');

    const gibiMessage: IGibiIntervalResponseMessage = {
        status: parseInt(fieldOneSplit[1].trim().replace(regex, ''), 10),
        setting: Number(fields[1]),
        responseId: fields[2],
    };
    return gibiMessage;
};

const parseOtaResponse = (fields: string[]) => {
    const fieldOneSplit = fields[0].split(':');
    const regex = new RegExp('"', 'g');

    const otaResponseReport: IGibiOtaResponseMessage = {
        status: parseInt(fieldOneSplit[1].trim().replace(regex, ''), 10),
        requestId: fields[1],
        timeStamp: new Date(parseInt(fields[2], 10) * 1000),
    };
    return otaResponseReport;
};

const parseSleepResponse = (fields: string[]) => {
    const regex = new RegExp('"', 'g');
    const fieldOneSplit = fields[0].split(':');
    const sleepResponseReport: IGibiSleepResponse = {
        requestId: fieldOneSplit[1].trim().replace(regex, '')
    };
};

const parseWakeEvent = (fields: string[]) => {
    const regex = new RegExp('"', 'g');
    const fieldOneSplit = fields[0].split(':');
    const wakeResponseReport: IGibiWakeResponse = {
        reason: parseInt(fieldOneSplit[1].trim().replace(regex, ''), 10),
        requestId: fields[1].trim(),
    };
    return wakeResponseReport;
};

const messageFunctionMap: { [key: string]: Function } = {
    '$LOC': parseLocation,
    '$BGI': parseIntervalResponse,
    '$OTA': parseOtaResponse,
    '$SLP': parseSleepResponse,
    '$WAKE': parseWakeEvent,
};
