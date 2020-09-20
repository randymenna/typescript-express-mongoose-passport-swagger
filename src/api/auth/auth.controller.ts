import express from 'express';
import { generateToken } from '../helpers/jwtHelper' ;

export const genAuthToken = async (req: express.Request, res: express.Response, next: Function) => {
    const token = generateToken(req.user);
    if (token) {
        res.status(200).json(token);
    } else {
        res.status(500).json({'error': 'failed to generate jwt token after login'});
    }
};
