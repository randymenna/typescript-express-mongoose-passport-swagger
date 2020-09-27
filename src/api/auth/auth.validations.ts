import { body } from 'express-validator';

/**
 * @swagger
 *  components:
 *    responses:
 *      BearerToken:
 *        description: Authentication bearer token
 *        content:
 *          application/json:
 *            schema:
 *              token: string
 *            examples:
 *              Successful login:
 *                value:
 *                  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVmNmY2YjAxN2JkMGNmYTQyYmI5NDYzMSIsIm5hbWUiOiJCYXJuZXkgUnViYmxlIiwiZW1haWwiOiJiYXJuZXlAYmVkcm9jay5jb20ifSwiaWF0IjoxNjAxMTM3NjQzLCJleHAiOjE2MDExNTkyNDN9.xXf_UgwWMa95tZCbv16xFkN1ZNhaTXLfMNvl6EbV4fs
 *
 *      AuthenticationError:
 *        description: Authentication failed
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      LocalLoginRequest:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *        example:
 *           email: barney@bedrock.com
 *           password: secretPasswod
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      ImpersonateLoginRequest:
 *        type: object
 *        required:
 *          - email
 *          - password
 *          - username
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *          username:
 *            type: string
 *            format: email
 *        example:
 *           email: barney@bedrock.com
 *           password: secretPassword
 *           username: fred@bedrock.com
 */

export const validationRules = (method: string): any[] => {
    switch (method) {
        case 'local':
            return [
                body('email')
                    .notEmpty()
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('email is required'),
                body('password')
                    .notEmpty()
                    .withMessage('password is required'),
            ];
        default:
            return [];
    }
};
