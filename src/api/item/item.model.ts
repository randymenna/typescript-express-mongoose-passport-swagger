import { model, Schema } from 'mongoose';

export enum ItemTypesEnum {
    DOG = 'dog',
    GOAT = 'goat',
    PERSON = 'person'
}

const ItemTypes = Object.values(ItemTypesEnum);

const ItemSchema: Schema = new Schema({
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            index: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        type: {
            type: String,
            required: true,
            enum: ItemTypes,
            index: true,
        },
        itemId: {
            type: String,
            require: true,
            trim: true,
        },
        device: {
            type: Schema.Types.ObjectId,
            ref: ' Device',
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        meta: {
            type: Schema.Types.Mixed,
        },
        last10Locations: [{
            type: Schema.Types.ObjectId,
            ref: ' Location',
            index: true,
        }],
        geoFences: [{
            fence: {
                type: Schema.Types.ObjectId,
                ref: 'GeoFence',
            },
            alert: {
                type: Schema.Types.ObjectId,
                ref: 'Alert',
            },
        }],
    },
    {
        timestamps: true,
    },
);

export const Item = model('Item', ItemSchema);
