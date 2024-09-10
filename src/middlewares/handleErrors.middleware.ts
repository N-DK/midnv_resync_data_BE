import { NextFunction, Request, Response } from 'express';
import {
    Api404Error,
    BaseError,
    BusinessLogicError,
    Api401Error,
    Api403Error,
} from '../core/error.response';

const logError = (err: any) => {
    console.error('logErrorMiddleware::::', err);
};

const logErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logError(err);
    if (err.status !== 401) {
        // ...
    }

    next(err);
};

const returnError = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
        result: false,
        status: statusCode,
        message: error.message || 'Internal server error',
        errors: error.errors,
    });
};

const isOperationalError = (error: any) => {
    if (error instanceof BaseError) {
        return error.isOperational;
    }
    return false;
};

const is404Handler = (req: Request, res: Response, next: NextFunction) => {
    const error = new Api404Error();
    next(error);
};

const handleCastErrorDB = (err: any) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new BusinessLogicError(message);
};

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new BusinessLogicError(message);
};

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    console.log(errors);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new BusinessLogicError(message);
};

const handlerJWTError = (err: any) => {
    console.error(err);
    const message = `Invalid token. Please login again!`;
    return new Api401Error(message);
};

const handlerJWTExpiredError = (err: any) => {
    console.error(err);
    const message = `Your token has expired! Please log in again.`;
    return new Api403Error(message);
};

export {
    logError,
    logErrorMiddleware,
    returnError,
    isOperationalError,
    is404Handler,
};
