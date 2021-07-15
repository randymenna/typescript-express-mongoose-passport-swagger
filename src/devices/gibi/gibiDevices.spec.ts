import { buildMessage } from './gibiDevices';
import { expect } from 'chai';
import 'mocha';

const gibiMessage = '$LOC: "BG",1,1602226961,+30.244225,-097.775946,0,000.000,000.000,5,15,300,00,1,T-Mobile,2,11;8901260761363838049';
const geoJsonPoint = {
    type: 'Feature',
    properties: {
        'featureType': 'gibiPosition',
        'status': 1,
        'timeStamp': 1602226961,
        'latitude': 30.244225,
        'longitude': -97.775946,
        'altitude': 0,
        'speed': 0,
        'heading': 0,
        'accuracy': 5,
        'ttf': 15,
        'battery': '300',
        'chargerStatus': '00',
        'chargingStatus': 1,
        'mobileOperator': 'T-Mobile',
        'rssi': 11,
        'deviceId': '8901260761363838049',
        'rawData': '$LOC: "BG",1,1602226961,+30.244225,-097.775946,0,000.000,000.000,5,15,300,00,1,T-Mobile,2,11;8901260761363838049',
    },
    geometry: {
        type: 'Point',
        coordinates: [30.244225, -97.775946],
    }
};

describe('Parse gibi device location mesage', () => {
    it('should return a geoJson point', () => {
        const result = buildMessage(gibiMessage);
        expect(JSON.stringify(result)).to.equal(JSON.stringify(geoJsonPoint));
    });

});
