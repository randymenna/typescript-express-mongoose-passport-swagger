import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Billing:
 *        type: object
 *        required:
 *          - account
 *          - customerId
 *          - provider
 *        optional:
 *          - meta
 *        properties:
 *          account:
 *            type: string
 *            description: objectId
 *          customerId:
 *            type: string
 *          provider:
 *             type: string
 *          meta:
 *             type: Object
 *        example:
 */

const BillingSchema: Schema = new Schema({
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Account'
        },
        customerId: {
            type: String,
            required: true,
        },
        provider: {
            type: String,
        },
        meta: {
            type: Object,
        },
    },
    {
        timestamps: true,
    },
);

export const Billing = model('Billing', BillingSchema);
