import express from 'express';
import { createUser, } from '../helpers/userHelper';
import { User } from './user.model';
import { IMongoWriteResult } from 'src/api/helpers/types';

/**
 * @swagger
 * path:
 *  /user/:
 *    post:
 *      summary: New User
 *      tags: [User]
 *      description: Create a new User
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        '200':
 *           description: The User is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */

export const newUser = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
        password,
        name,
        isSuperUser,
    } = req.body;

    // const passwordHashed = await argon2.hash(password);
    const user = await createUser(email, password, name, isSuperUser);
    if (user) {
        // @ts-ignore
        res.status(201).json(user);
    } else {
        res.status(422).json(email);
    }
};

/**
 * @swagger
 * path:
 *  /user/{email}:
 *    get:
 *      summary: Get an existing User
 *      tags: [User]
 *      description: Retrieve a single User by by email
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: email
 *          description: email of user
 *          in: path
 *          required: true
 *          type: string
 *          example: barney@bedrock.com
 *      responses:
 *        '200':
 *           description: The User is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */

export const getUser = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
    } = req.params;

    try {
        const user = await User.find({email});
        res.status(200).json(user);
    }
    catch (e) {
        res.status(500).json({error: 'failed to find user after validation', e});
    }
};

/**
 * @swagger
 * path:
 *  /user:
 *    get:
 *      summary: Get current User
 *      tags: [User]
 *      description: Get the profile of the current user
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *           description: The User is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */

export const me = async (req: express.Request, res: express.Response, next: Function) => {
    res.status(200).json(req.user);
};

/**
 * @swagger
 * path:
 *  /user/:
 *    put:
 *      summary: Update a User
 *      tags: [User]
 *      description: Update any properties of a User
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        '200':
 *           description: The User is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */

export const updateUser = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
    } = req.body;
    try {
        const user = await User.find({email});
        const updatedUser = Object.assign({}, user, req.body);
        delete updatedUser.email;

        const retVal: IMongoWriteResult = await User.update({email}, updatedUser);
        if (retVal.deletedCount) {
            res.status(200).json(retVal);
        } else {
            res.status(417).json({error: 'failed to update user'});
        }
    }
    catch (e) {
        res.status(500).json({error: 'failed to delete user', e});
    }
};

/**
 * @swagger
 * path:
 *  /user/{email}:
 *    delete:
 *      summary: Remove a User
 *      tags: [User]
 *      description: Permanently remove a User
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: email
 *          description: email of user
 *          in: path
 *          required: true
 *          type: string
 *          example: barney@bedrock.com
 *      responses:
 *        '200':
 *           description: The User is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */

export const deleteUser = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        key,
    } = req.params;
    try {
        const retVal: IMongoWriteResult = await User.deleteOne({key});
        if (retVal.deletedCount) {
            res.status(200).json(retVal);
        } else {
            res.status(417).json({error: 'failed to delete api key'});
        }
    }
    catch (e) {
        res.status(500).json({error: 'failed to delete api key', e});
    }
};

/**
 * @swagger
 * path:
 *  /users:
 *    get:
 *      summary: Get Users
 *      tags: [User]
 *      description: Retrieve all the Users
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *           description: An array of Users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const getAllUsers = async (req: express.Request, res: express.Response, next: Function) => {
    const users = await User.find();
    res.status(200).json(users);
};
