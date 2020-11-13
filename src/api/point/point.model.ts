import { model, Schema } from 'mongoose';

const PointSchema = new Schema({
    type: {$type: String, default: 'Feature'},
    geometry: {
        type: {$type: String, default: 'Point'},
        coordinates: {$type: [Number], default: [0, 0]}
    },
    properties: Schema.Types.Mixed,
}, {typeKey: '$type'});

PointSchema.index({geometry: '2dsphere'});

export const Point = model('Point', PointSchema);
