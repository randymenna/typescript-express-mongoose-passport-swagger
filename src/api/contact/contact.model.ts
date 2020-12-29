import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Contact:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - phoneNumber
 *          - user
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          phoneNumber:
 *             type: string
 *          account:
 *              type: ObjectId
 *          user:
 *              type: ObjectId
 */

const ContactSchema: Schema = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: Object,
        },
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
    },
    {
        timestamps: true,
    },
);

export const Contact = model('Contact', ContactSchema);
