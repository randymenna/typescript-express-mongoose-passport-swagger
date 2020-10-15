import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Account:
 *        type: object
 *        required:
 *          - owner
 *          - users
 *          - name
 *          - description
 *          - status
 *          - billing
 *          - subscription
 *          - geoFences
 */

export enum EAccountStatus {
    ACTIVE = 'active',
    TRIAL = 'trial',
    BILLING = 'billing',
    INACTIVE = 'inactive'
}

const AccountSchema: Schema = new Schema({
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true, // owner must be user
        }],
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(EAccountStatus),
            index: true,
        },
        billing: {
            type: Schema.Types.ObjectId,
            ref: 'Billing',
        },
        subscription: {
            type: Schema.Types.ObjectId,
            ref: 'Subscription'
        },
        geoFences: [{
            type: Schema.Types.ObjectId,
            ref: 'GeoFence',
            required: false
        }]
    },
    {
        timestamps: true,
    },
);

AccountSchema.pre('save', (next) => {
    if (this) {
        // @ts-ignore
        if (this.isNew) {
            // @ts-ignore
            if (!this.users) {
                // @ts-ignore
                this.users = [this.owner];
            } else {
                // @ts-ignore
                const owner = this.users.indexOf(this.owner);
                if (!owner) {
                    // @ts-ignore
                    this.users.push(owner);
                }
            }
        }
    }
});

export const Account = model('Account', AccountSchema);
