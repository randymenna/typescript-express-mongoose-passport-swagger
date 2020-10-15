import mongoose, { model, Schema } from 'mongoose';

export const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    properties: {
        type: Schema.Types.Mixed,
        required: false
    }
});
pointSchema.index({'properties.deviceId': 'text'});
export const Positions = model('Positions', pointSchema);

export const polygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
    },
    coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        required: true
    },
    properties: {
        type: Object,
        required: false
    }
});
polygonSchema.index({'properties.account': 'text'});


export const multiPolygonSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['MultiPolygon'],
        required: true
    },
    coordinates: {
        type: [[[[Number]]]], // Array of polygon cooordinates
        required: true
    },
    properties: {
        type: Object,
        required: false
    }
});
multiPolygonSchema.index({'properties.account': 'text'});

export const connectToMongo = () => {
    return new Promise((resolve, reject) => {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useUnifiedTopology', true);

        // Connect to mongo using mongoose
        mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection;
        db.once('open', () => {
            console.log('Mongoose connected');
            resolve(db);
        });
        db.on('error', (err) => {
            console.error('Mongoose connect error', err);
            reject();
        });
    });
};


