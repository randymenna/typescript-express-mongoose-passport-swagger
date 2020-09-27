import { model, Schema } from 'mongoose';
import { decrypt, encrypt } from '../helpers/cryptoHelper';

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        optional:
 *          - isSuperUser
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *             type: string
 *             description: encrypted when stored in the database
 *          isSuperUser:
 *             type: boolean
 *        example:
 *           name: Barney Rubble
 *           email: barney@bedrock.com
 *           password: secretPassword
 */

const UserSchema: Schema = new Schema({
        email: {
            type: String,
            required: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            set: encrypt,
            get: decrypt,
        },
        name: {
            type: String,
            required: true,
        },
        isSuperUser: {
            type: Boolean,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

export const User = model('User', UserSchema);
