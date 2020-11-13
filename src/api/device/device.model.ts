import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Device:
 *        type: object
 *        required:
 *          - account
 *          - owner
 *          - mfg
 *          - meta
 *        optional:
 *          - isSuperItem
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *             type: string
 *             description: encrypted when stored in the database
 *          isSuperItem:
 *             type: boolean
 *        example:
 *           name: Barney Rubble
 *           email: barney@bedrock.com
 *           password: secretPassword
 */
const DeviceSchema: Schema = new Schema({
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
        mfg: {
            type: String,
            required: true,
        },
        meta: {
            type: Schema.Types.Mixed,
        },
    },
    {
        timestamps: true,
    },
);

export const Device = model('Device', DeviceSchema);
