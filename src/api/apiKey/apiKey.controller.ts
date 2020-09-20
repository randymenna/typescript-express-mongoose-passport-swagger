import express from 'express';
import uuidAPIKey from 'uuid-apikey';
import { createApiKey, } from '../helpers/apiKeyHelper';
import { ApiKey } from './apiKey.model'

export const newApiKey = async (req: express.Request, res: express.Response, next: Function) => {
    const {
        email,
    } = req.body;

    const key = uuidAPIKey.create().apiKey;
    const apiKey = await createApiKey(key, email);
    if (apiKey) {
        // @ts-ignore
        res.status(201).json(apiKey);
    } else {
        res.status(500).json({error: 'failed to create api key'});
    }
};

export const updateApiKey = async (req: express.Request, res: express.Response, next: Function) => {
};

export const deleteApiKey = async (req: express.Request, res: express.Response, next: Function) => {
};

export const getAllApiKeys = async (req: express.Request, res: express.Response, next: Function) => {
    const apiKeys = await ApiKey.find();
    res.status(200).json(apiKeys);
};
