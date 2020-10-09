import mongoose from 'mongoose';

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
        type: Object,
        required: false
    }
});

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


