import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      ApiKey:
 *        type: object
 *        required:
 *          - key
 *          - email
 *        properties:
 *          key:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: owner of the api key.
 *        example:
 *           key: 699JG9B-3EV4XA0-K1VJ7B5-S34CPS3
 *           email: fake@email.com
 */
const ApiKeySchema: Schema = new Schema({
        key: {
            type: String,
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    },
);

export const ApiKey = model('ApiKey', ApiKeySchema);
