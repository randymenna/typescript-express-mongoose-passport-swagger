import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Location:
 *        type: object
 *        required:
 *          - account
 *          - item
 *          - position
 *          - valid
 */

const LocationSchema: Schema = new Schema({
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
            index: true,
        },
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            index: true,
            required: true,
        },
        position: {
            type: Schema.Types.ObjectId,
            ref: 'Position',
            required: true,
        },
        valid: {
            type: Boolean,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Location = model('Location', LocationSchema);
