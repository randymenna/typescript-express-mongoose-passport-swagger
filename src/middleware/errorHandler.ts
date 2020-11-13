import { NextFunction, Request, Response } from 'express';
import ApiException from 'src/express/exceptions/ApiException';

const errorMiddleware = (error: ApiException, request: Request, response: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response
        .status(status)
        .send({
            status,
            message,
        });
};

export default errorMiddleware;
