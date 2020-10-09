import { model, Schema } from 'mongoose';
import { polygonSchema } from 'src/mongoose/mongoose';

/**
 * @swagger
 *  components:
 *    schemas:
 *      GeoFence:
 *        type: object
 *        required:
 *          - type
 *          - name
 *          - fence
 *        optional:
 *          - meta
 *        properties:
 *          type:
 *            type: enum
 *          name:
 *            type: string
 *          fence:
 *             type: Object
 *             description: polygon
 *          meta:
 *             type: Object
 *        example:
 */


export enum GeoFenceTypeEnum {
    EXIT = 'exit',
    ENTER = 'enter',
    EXIT_ENTER = 'exitEnter',
}

const FenceTypes = Object.values(GeoFenceTypeEnum);

const GeoFenceSchema: Schema = new Schema({
        type: {
            type: String,
            enum: FenceTypes,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        fence: {
            type: polygonSchema,
            required: true
        },
        meta: {
            type: Object,
        },
    },
    {
        timestamps: true,
    },
);

export const GeoFence = model('GeoFence', GeoFenceSchema);
