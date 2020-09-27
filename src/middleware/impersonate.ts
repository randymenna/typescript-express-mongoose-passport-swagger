import express from 'express';
import { User } from '../api/user/user.model';

export const impersonate = async (req: express.Request, res: express.Response, next: Function) => {
    // @ts-ignore
    if (!req.user.isSuperUser) {
        return next();
    }

    const impersonatedUser = await User.findOne({email: req.body.username});
    req.user = impersonatedUser;
    next();
};
