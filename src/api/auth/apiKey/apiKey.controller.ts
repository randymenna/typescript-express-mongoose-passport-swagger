import express from 'express';
import uuidAPIKey from 'uuid-apikey';
import { createApiKey, } from 'src/api/helpers/apiKeyHelper';
import { ApiKey } from 'src/api/auth/apiKey/apiKey.model';
import { IMongoWriteResult } from 'src/api/helpers/types';

/**
 * @swagger
 * tags:
 *   name: ApiKey
 *   description: Api Key management
 */

/**
 * @swagger
 * path:
 *  /apiKey/{email}:
 *    post:
 *      tags: [ApiKey]
 *      summary: Create ApiKeys
 *      description: Create an Api Key assigned to a user
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: email
 *          description: email of user assigned api key
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *            example: barney@bedrock.com
 *      responses:
 *        '200':
 *           description: The Api key is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiKey'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const newApiKey = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
    } = req.params;

    try {
        const key = uuidAPIKey.create().apiKey;
        const apiKey = await createApiKey(key, email);
        // @ts-ignore
        res.status(201).json(apiKey);
    }
    catch (e) {
        res.status(500).json({error: 'failed to create api key', e});
    }
};

/**
 * @swagger
 * path:
 *  /apiKey/{key}:
 *    delete:
 *      summary: Delete an  Api Key
 *      tags: [ApiKey]
 *      description: Permanently removes a single Api Key
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: key
 *          description: the api key
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *            example: C9QJWK9-BT2MJJN-Q8VBGVK-X03JFJ6
 *      responses:
 *        '200':
 *           description: The deleted api key is returned
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiKey'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const deleteApiKey = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        key,
    } = req.params;
    try {
        const retVal: IMongoWriteResult = await ApiKey.deleteOne({key});
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
 *  /apiKey/{key}:
 *    get:
 *      summary: Get an existing Api Key
 *      tags: [ApiKey]
 *      description: Retrieve a single Api Key by Id or by Key (one required)
 *      security:
 *        - bearerToken: []
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: key
 *          description: the api key (optional)
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *            example: C9QJWK9-BT2MJJN-Q8VBGVK-X03JFJ6
 *      responses:
 *        '200':
 *           description: An api key schema
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ApiKey'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const getApiKey = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        key,
    } = req.params;

    try {
        const retVal = await ApiKey.findOne({key});
        res.status(200).json(retVal);
    }
    catch (e) {
        res.status(404).json({error: 'key or id not found', e});
    }
};

/**
 * @swagger
 *
 * /apiKeys/{email}:
 *   get:
 *     summary: Get a Users Api keys
 *     tags: [ApiKey]
 *     description: Get all the api keys associated with the specified email
 *     security:
 *       - bearerToken: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email owner of the api key.
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: barney@bedrock.com
 *
 *     responses:
 *        '200':
 *           description: An array of api keys
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ApiKey'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const keysForEmail = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
    } = req.params;
    try {
        const apiKeys = await ApiKey.find({email});
        res.status(200).json(apiKeys);
    }
    catch (e) {
        res.status(500).json({error: 'failed to find api key', e});
    }
};

/**
 * @swagger
 * path:
 *  /apiKeys:
 *    get:
 *      summary: Get all the Api Keys
 *      tags: [ApiKey]
 *      description: Retrieves all the Api keys
 *      security:
 *        - apiKeyQuery: []
 *        - apiKeyHeader: []
 *      produces:
 *        - application/json
 *      responses:
 *        '200':
 *           description: An array of api keys
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ApiKey'
 *        '422':
 *            $ref: '#/components/responses/ValidationError'
 *        '500':
 *            $ref: '#/components/responses/SystemError'
 */
export const getAllApiKeys = async (req: express.Request, res: express.Response, next: Function) => {
    try {
        const apiKeys = await ApiKey.find();
        res.status(200).json(apiKeys);
    }
    catch (e) {
        res.status(500).json({error: 'failed to find api keys', e});
    }
};
