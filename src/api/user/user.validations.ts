import { body, param } from 'express-validator';
import { emailExists, emailNotExist } from '../helpers/validatorHelpers';

export const validationRules = (method: string): any[] => {
    switch (method) {
        case 'newUser':
            return [
                body('email')
                    .exists()
                    .withMessage('email missing')
                    .notEmpty()
                    .withMessage('email is empty')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('not valid email')
                    .custom(emailNotExist)
                    .withMessage('email in use'),
                body('password')
                    .exists()
                    .withMessage('password missing')
                    .notEmpty()
                    .withMessage('password is empty'),
                body('name')
                    .exists()
                    .withMessage('name missing')
                    .notEmpty()
                    .withMessage('name is empty')
            ];
        case 'updateUser':
            return [
                body('email')
                    .exists()
                    .withMessage('email missing')
                    .notEmpty()
                    .withMessage('email is empty')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('not valid email'),
            ];
        case 'deleteUser':
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
                    .withMessage('user not found'),
            ];
        case 'getUser':
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
                    .withMessage('user not found'),
            ];
        default:
            return [];
    }
};
