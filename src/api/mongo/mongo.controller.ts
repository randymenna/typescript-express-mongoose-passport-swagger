import express from 'express';
import { IMongoWriteResult } from 'src/api/helpers/types';
import { Models } from '../../config/types';

/**
 * @swagger
 * tags:
 *   name: Mongo
 *   description: Universal MongoDb collection CRUD
 */

/**
 * @swagger
 * path:
 *  /{collection}:
 *    post:
 *      summary: Create a document
 *      tags: [User]
 *      description: Create a new document and add it to the *collection*
 *      security:
 *        - bearerToken: []
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: collection
 *          description: name of mongo collection
 *          in: path
 *          required: true
 *          type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
export const create = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        collection,
    } = req.params;

    try {
        const doc = await Models[collection].create(req.body);
        res.status(200).json(doc);
    }
    catch (e) {
        res.status(500).json({error: `failed to create ${collection}`, e});
    }
};

/**
 * @swagger
 * path:
 *  /{collection}:
 *    put:
 *      summary: Update a document
 *      tags: [User]
 *      description: Update a document in *collection*
 *      security:
 *        - bearerToken: []
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: collection
 *          description: name of mongo collection
 *          in: path
 *          required: true
 *          type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
export const update = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        collection,
        id,
    } = req.params;

    if ('_id' in req.body || '__v' in req.body) {
        delete req.body._id;
        delete req.body.__v;
    }
    try {
        const retVal: IMongoWriteResult = await Models[collection].update({id}, req.body);
        if (retVal.nModified) {
            res.status(200).json(retVal);
        } else {
            res.status(417).json({error: `failed to update ${collection}/${id}`});
        }
    }
    catch (e) {
        res.status(500).json({error: `failed to update ${collection}/${id}`, e});
    }
};

/**
 * @swagger
 * path:
 *  /{collection}/{id}:
 *    delete:
 *      summary: Delete a document
 *      tags: [User]
 *      description: Delete a document in *collection*
 *      security:
 *        - bearerToken: []
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: collection
 *          description: name of mongo collection
 *          in: path
 *          required: true
 *          type: string
 *        - name: id
 *          description: id of document
 *          in: path
 *          required: true
 *          type: string
 */
export const remove = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        collection,
        id,
    } = req.params;

    try {
        const retVal: IMongoWriteResult = await Models[collection].deleteOne({id});
        if (retVal.deletedCount) {
            res.status(200).json(retVal);
        } else {
            res.status(417).json({error: `failed to delete ${collection}/${id}`});
        }
    }
    catch (e) {
        res.status(500).json({error: `failed to create ${collection}/${id}`, e});
    }
};

/**
 * @swagger
 * path:
 *  /{collection}/{id}:
 *    get:
 *      summary: Create a document
 *      tags: [User]
 *      description: Create a new document and add it to the *collection*
 *      security:
 *        - bearerToken: []
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: collection
 *          description: name of mongo collection
 *          in: path
 *          required: true
 *          type: string
 *        - name: id
 *          description: id of document
 *          in: path
 *          required: true
 *          type: string
 */
export const retrieve = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        collection,
        id,
    } = req.params;

    try {
        const doc = await Models[collection].findOne({id});
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({error: `failed to find ${collection}/${id}`});
        }
    }
    catch (e) {
        res.status(500).json({error: `failed to find ${collection}/${id}`, e});
    }
};

export const list = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        collection,
    } = req.params;

    try {
        const docs = await Models[collection].find();
        if (docs) {
            res.status(200).json(docs);
        } else {
            res.status(404).json({error: `failed to find ${collection}`});
        }
    }
    catch (e) {
        res.status(500).json({error: `failed to find ${collection}`, e});
    }
};
