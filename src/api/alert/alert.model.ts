import { model, Schema } from 'mongoose';

export enum AlertTypesEnum {
    ON_ENTRANCE = 'entrance',
    ON_EXIT = 'exit',
}

const AlertSchema: Schema = new Schema({
        type: [{
            enum: Object.values(AlertTypesEnum),
        }],
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        contacts: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],

    },
    {
        timestamps: true,
    },
);

export const Alert = model('Alert', AlertSchema);
