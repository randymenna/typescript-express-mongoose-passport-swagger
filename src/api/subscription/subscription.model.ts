import { model, Schema } from 'mongoose';
import { ItemTypesEnum } from '../item/item.model';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Subscription:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        optional:
 *          - isSuperSubscription
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *             type: string
 *             description: encrypted when stored in the database
 *          isSuperSubscription:
 *             type: boolean
 *        example:
 */


export enum ESubscriptionTypes {
    ONE_TIME = 'oneTime',
    DAILY = 'daily',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    NEVER_ENDING = 'neverEnding',
}

const SubscriptionSchema: Schema = new Schema({
        type: [{
            enum: Object.values(ItemTypesEnum),
        }],
        name: {
            type: String,
            required: true,
        },
        description: {
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

export const Subscription = model('Subscription', SubscriptionSchema);
