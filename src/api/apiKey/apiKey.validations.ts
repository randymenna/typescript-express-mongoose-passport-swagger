import { param } from 'express-validator';
import { emailExists, keyExists } from '../helpers/validatorHelpers';

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
        case 'newApiKey':
            return [
                param('email')
                    .exists()
                    .withMessage('email missing')
                    .notEmpty()
                    .withMessage('email is empty')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('not valid email')
                    .custom(emailExists)
                    .withMessage('email not found'),
            ];
        case 'getApiKey':
            return [
                param('key')
                    .exists()
                    .withMessage('key missing')
                    .notEmpty()
                    .withMessage('key is empty')
                    .custom(keyExists)
                    .withMessage('invalid key'),
            ];
        case 'deleteApiKey':
            return [
                param('key')
                    .exists()
                    .withMessage('key missing')
                    .notEmpty()
                    .withMessage('key is empty')
                    .custom(keyExists)
                    .withMessage('invalid key'),
            ];
        case 'keysForEmail':
            return [
                param('email')
                    .exists()
                    .withMessage('email missing')
                    .notEmpty()
                    .withMessage('email is empty')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('not valid email')
                    .custom(emailExists)
                    .withMessage('email not found'),
            ];
        default:
            return [];
    }
};
