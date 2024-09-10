import { validationResult } from 'express-validator';
import { BusinessLogicError } from '../core/error.response';
import constants from '../constants/msg.constant';
import { NextFunction, Request, Response } from 'express';
import statusCodes from '../core/statusCodes';

const catchAsync =
    (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors: any = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    new BusinessLogicError(constants.ERROR, errors.array()),
                );
            }
            return await Promise.resolve(fn(req, res, next));
        } catch (err: any) {
            return next(
                new BusinessLogicError(
                    err?.msg ||
                        ((err?.status === 401 || err?.status === 403) &&
                            err?.message) ||
                        constants.SERVER_ERROR,
                    err?.errors || [],
                    err?.status || statusCodes.INTERNAL_SERVER_ERROR,
                ),
            );
        }
    };

export default catchAsync;
