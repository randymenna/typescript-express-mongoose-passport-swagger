
const raw = () => {
    var rawReports = []; // APV: ADDED HACK
    rawReports[0]  = ""; // APV: ADDED HACK
    rawReports[1]  = message.data.substring(message.data.indexOf('$')+1); // APV: ADDED HACK

    var deviceReports = new Array();
    // start at the 2nd position in the array, as the first will have a $ only
    for(var i=1; i < rawReports.length; i++) {
        var deviceReport = build(rawReports[i]);
        deviceReports.push(deviceReport);
    }
}

const build = (reportFromDevice: string) => {

    var fieldsAndDeviceId = reportFromDevice.split(';');

    var fieldsAsCSV = fieldsAndDeviceId[0];
    var fields = fieldsAsCSV.split(',');

    var deviceReport = {};
    var fieldOneSplit = fields[0].split(':');
    var parseFunction = this.parseFunctionMap[fieldOneSplit[0].trim()];
    if (parseFunction !== undefined) {
        deviceReport = parseFunction(fields);
    }
    else {
        deviceReport       = {};
        deviceReport.type  = fields[0];
    }
    deviceReport.deviceId = fieldsAndDeviceId[1].replace(/(\r\n|\n|\r)/gm,"");
    deviceReport.actualReport = reportFromDevice;
    deviceReport.systemTimestamp = new Date();

    return deviceReport;
}

const parseGibiData = (fields) => {

    var deviceReport = {};

    var fieldOneSplit = fields[0].split(':');

    deviceReport.type = fieldOneSplit[0].trim();

    var regex = new RegExp('"', 'g');

    if (fieldOneSplit.length == 2 && deviceReport.type == 'LOC') {
        deviceReport.prefix    = fieldOneSplit[1].trim().replace(regex, '');
    }
    deviceReport.status         = parseInt(fields[1]);
    deviceReport.timeStamp      = parseInt(fields[2]);
    deviceReport.latitude       = parseFloat(fields[3]);
    deviceReport.longitude      = parseFloat(fields[4]);
    deviceReport.altitude       = parseFloat(fields[5]);

    deviceReport.speed          = this.extractFloat(fields[6],-1);
    deviceReport.heading        = this.extractFloat(fields[7],-1);
    deviceReport.accuracy       = this.extractInteger(fields[8],0);
    deviceReport.ttf            = this.extractInteger(fields[9],0);

    deviceReport.battery              =  fields[10];
    deviceReport.batteryPctRemaining  = this._batteryUtil.valueToPercent(deviceReport.battery);

    deviceReport.chargerStatus        = fields[11];
    deviceReport.chargingStatus       = parseInt(fields[12]);


    if (deviceReport.prefix === 'PU') {
        if (fields.length === 17) {
            deviceReport.mobileOperator   = fields[13].trim().replace(regex,'');
            deviceReport.networkGen       = this.getNetworkGen(fields[14]);
            deviceReport.rssi             = parseInt(fields[15]);
            deviceReport.firmwareVersion  = fields[16];
        } else if (fields.length === 16) {
            deviceReport.mobileOperator   = 'UNKNOWN';
            deviceReport.networkGen       = this.getNetworkGen(fields[13]);
            deviceReport.rssi             = parseInt(fields[14]);
            deviceReport.firmwareVersion  = fields[15];
        }
        else {
            deviceReport.firmwareVersion = fields.length >= 14 ? fields[13] : "UNKNOWN";
        }
    } else {
        if (fields.length === 16) {
            deviceReport.mobileOperator   = fields[13].trim().replace(regex,'');
            deviceReport.networkGen       = this.getNetworkGen(fields[14]);
            deviceReport.rssi             = parseInt(fields[15]);
        }
    }

    return deviceReport;
};

// overload winston

console.log = (...args) => logger.info.call(logger, ...args);
console.info = (...args) => logger.info.call(logger, ...args);
console.warn = (...args) => logger.warn.call(logger, ...args);
console.error = (...args) => logger.error.call(logger, ...args);
console.debug = (...args) => logger.debug.call(logger, ...args);
