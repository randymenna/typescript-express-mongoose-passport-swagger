import { body, param } from 'express-validator';
import { emailExists, emailNotExist, validateRole } from '../helpers/validatorHelpers';

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
                body('app')
                    .exists()
                    .withMessage('app missing')
                    .notEmpty()
                    .withMessage('app is empty'),
                body('role')
                    .exists()
                    .withMessage('role missing')
                    .notEmpty()
                    .withMessage('role is empty')
                    .custom(validateRole)
                    .withMessage('invalid role'),
            ];
        case 'deleteUser':
            return [
                body('email')
                    .exists()
                    .withMessage('email missing')
                    .notEmpty()
                    .withMessage('email is empty')
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('not valid email')
                    .custom(emailExists)
                    .withMessage('email not found'),
                body('app')
                    .exists()
                    .withMessage('app missing')
                    .notEmpty()
                    .withMessage('app is empty'),
            ];
        default:
            return [];
    }
};
