export enum GibiMessageType {
    'LOCATION_RESPONSE' = 'locationResponse',
    'BACKGROUND_LOCATION' = 'backgroundLocation',
    'POWER_UP' = 'powerUp',
    'POWER_DOWN' = 'powerDown',
    'FULL_CHAGE' = 'fullCharge',
    'BATTERY_ALERT' = 'batteryAlert',
    'FIND' = 'find',
    'BACKGROUND_INTERVAL' = 'backgroundInterval',
    'SLEEP_RESPONSE' = 'sleepResponse',
    'WAKE_RESPONSE' = 'wakeResponse',
    'OTA_UPGRADE' = 'otaUpgrade',
    'UNKNOWN' = 'unknown',
}

export interface IGibiLocationMessage {
    status: number;
    timeStamp: number;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    heading: number;
    accuracy: number;
    ttf: number;
    battery: any;
    // batteryPctRemaining: number;
    chargerStatus: any;
    chargingStatus: number;
    mobileOperator: any;
    // networkGen: number;
    rssi: number;
    deviceId: string;
    receivedTime: Date;
}

export interface IGibiIntervalResponseMessage {
    status: number;
    setting: number;
    responseId: string;
}

export interface IGibiOtaResponseMessage {
    status: number;
    requestId: string,
    timeStamp: Date,
}

export interface IGibiSleepResponse {
    requestId: string;
}

export interface IGibiWakeResponse {
    reason: number;
    requestId: string;
}

export interface IGibiMessage {
    commandType: GibiMessageType;
    deviceId: string;
    data: IGibiLocationMessage | IGibiIntervalResponseMessage | IGibiSleepResponse | IGibiOtaResponseMessage;
    rawData: string;
    receivedTime: Date;
}

export enum GibiWakeReasonEnum {
    SYSTEM_CANCELED_SLEEP = 0,
    DEVICE_WOKE_UP = 1,
    USER_CANCELED_SLEEP = 2,
}
