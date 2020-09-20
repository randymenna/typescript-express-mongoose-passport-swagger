import express from 'express';
import { validationResult } from 'express-validator'

export const validate = (req: express.Request, res: express.Response, next: Function) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors: { [x: string]: any; }[] = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};
