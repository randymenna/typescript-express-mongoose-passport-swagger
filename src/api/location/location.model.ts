import { model, Schema } from 'mongoose';
import { pointSchema } from 'src/mongoose/mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Location:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        optional:
 *          - isSuperLocation
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *          password:
 *             type: string
 *             description: encrypted when stored in the database
 *          isSuperLocation:
 *             type: boolean
 *        example:
 */

const LocationSchema: Schema = new Schema({
        account: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            index: true,
        },
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            index: true,
            required: true,
        },
        position: {
            type: pointSchema,
            required: true,
        },
        valid: {
            type: Boolean,
            required: true,
        },
        meta: {
            type: Object,
        },
    },
    {
        timestamps: true,
    },
);

export const Location = model('Location', LocationSchema);
