import express from 'express';
import { generateToken } from '../helpers/jwtHelper';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiKeyHeader:
 *       type: apiKey
 *       in: header
 *       name: apikey
 *       description: API Key in header
 *
 *     apiKeyQuery:
 *       type: apiKey
 *       in: query
 *       name: apikey
 *       description: API Key in query
 *
 *     bearerToken:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT Bearer Token **_only_**
 *
 *     basicAuth:
 *       type: http
 *       scheme: basic
 *       description: User / Password
 */

/**
 * @swagger
 * path:
 *  /auth/local/:
 *    post:
 *      summary: Login - local
 *      tags: [Auth]
 *      description: Username and Password login
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LocalLoginRequest'
 *      responses:
 *        '200':
 *           $ref: '#/components/responses/BearerToken'
 *        '401':
 *            $ref: '#/components/responses/AuthenticationError'
 */

/**
 * @swagger
 * path:
 *  /auth/basic/:
 *    post:
 *      summary: Login - basic
 *      tags: [Auth]
 *      description: Http Basic Auth (username/password)
 *      responses:
 *        '200':
 *           $ref: '#/components/responses/BearerToken'
 *        '401':
 *            $ref: '#/components/responses/AuthenticationError'
 */

/**
 * @swagger
 * path:
 *  /auth/impersonate/:
 *    post:
 *      summary: Login - Impersonate User
 *      tags: [Auth]
 *      description: Login as another user. Must have super user privileges
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ImpersonateLoginRequest'
 *      responses:
 *        '200':
 *           $ref: '#/components/responses/BearerToken'
 *        '401':
 *            $ref: '#/components/responses/AuthenticationError'
 */

export const genAuthToken = async (req: express.Request, res: express.Response, next: Function) => {
    const token = generateToken(req.user);
    if (token) {
        res.status(200).json({token});
    } else {
        res.status(500).json({'error': 'failed to generate jwt token after login'});
    }
};
