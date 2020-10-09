import { param } from 'express-validator';
import { collectionExists } from 'src/api/helpers/validatorHelpers';

/**
 * @swagger
 *  components:
 *    responses:
 *      ValidationError:
 *        description: A parameter is invalid
 *        content:
 *          application/json:
 *            schema:
 *              parameter: string
 *            examples:
 *              Missing Parameter:
 *                value:
 *                  parameter: parameter is missing
 *              Invalid User:
 *                value:
 *                  parameter: user not found
 *
 *      SystemError:
 *        description: A system error occurred
 *        content:
 *          application/json:
 *            schema:
 *              error: string
 *            examples:
 *              Database item not found:
 *                value:
 *                  error: key or id not found
 *              Database error:
 *                value:
 *                  error: failed to delete api key
 */

export const validationRules = (method: string): any[] => {
    switch (method) {
        case 'create':
            return [
                param('collection')
                    .exists()
                    .withMessage('collection missing')
                    .notEmpty()
                    .withMessage('collection is empty')
                    .custom(collectionExists)
                    .withMessage('collection not found'),
            ];
        case 'update':
            return [
                param('collection')
                    .exists()
                    .withMessage('collection missing')
                    .notEmpty()
                    .withMessage('collection is empty')
                    .custom(collectionExists)
                    .withMessage('collection not found'),
                param('id')
                    .exists()
                    .withMessage('id missing')
                    .notEmpty()
                    .withMessage('id is empty'),
            ];
        case 'remove':
            return [
                param('collection')
                    .exists()
                    .withMessage('collection missing')
                    .notEmpty()
                    .withMessage('collection is empty')
                    .custom(collectionExists)
                    .withMessage('collection not found'),
                param('id')
                    .exists()
                    .withMessage('id missing')
                    .notEmpty()
                    .withMessage('id is empty'),
            ];
        case 'retrieve':
            return [
                param('collection')
                    .exists()
                    .withMessage('collection missing')
                    .notEmpty()
                    .withMessage('collection is empty')
                    .custom(collectionExists)
                    .withMessage('collection not found'),
                param('id')
                    .exists()
                    .withMessage('id missing')
                    .notEmpty()
                    .withMessage('id is empty'),
            ];
        case 'list':
            return [
                param('collection')
                    .exists()
                    .withMessage('collection missing')
                    .notEmpty()
                    .withMessage('collection is empty')
                    .custom(collectionExists)
                    .withMessage('collection not found'),
            ];
        default:
            return [];
    }
};
