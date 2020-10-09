import { model, Schema } from 'mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Item:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
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

export enum ItemTypesEnum {
    DOG = 'dog',
    GOAT = 'goat',
    PERSON = 'person'
}

const ItemTypes = Object.values(ItemTypesEnum);

const ItemSchema: Schema = new Schema({
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
        type: {
            type: String,
            required: true,
            enum: ItemTypes,
            index: true,
        },
        itemId: {
            type: String,
            require: true,
            trim: true,
        },
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
        last5Locations: [{
            type: Schema.Types.ObjectId,
            ref: ' Location',
            index: true,
        }],
        geoFences: [{
            type: Schema.Types.ObjectId,
            ref: 'GeoFence',
            required: false,
        }],
    },
    {
        timestamps: true,
    },
);

export const Item = model('Item', ItemSchema);
