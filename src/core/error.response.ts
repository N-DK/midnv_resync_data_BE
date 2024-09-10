import { StatusCodes, ReasonPhrases } from './httpStatusCode';

class BaseError extends Error {
    status: any;
    errors: any;
    isOperational: boolean;

    constructor(
        message: string,
        status: any,
        errors: any,
        isOperational: boolean,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); //set
        this.status = status;
        this.errors = errors;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

class Api409Error extends BaseError {
    constructor(
        message = ReasonPhrases.CONFLICT,
        errors = [],
        status = StatusCodes.CONFLICT,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

class Api403Error extends BaseError {
    constructor(
        message = ReasonPhrases.FORBIDDEN,
        errors = [],
        status = StatusCodes.FORBIDDEN,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

class Api401Error extends BaseError {
    constructor(
        message = ReasonPhrases.UNAUTHORIZED,
        errors = [],
        status = StatusCodes.UNAUTHORIZED,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

class Api400Error extends BaseError {
    constructor(
        message = ReasonPhrases.METHOD_NOT_ALLOWED,
        errors = [],
        status = StatusCodes.BAD_REQUEST,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

class BusinessLogicError extends BaseError {
    constructor(
        message = ReasonPhrases.INTERNAL_SERVER_ERROR,
        errors = [],
        status = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

class Api404Error extends BaseError {
    constructor(
        message = ReasonPhrases.NOT_FOUND,
        errors = [],
        status = StatusCodes.NOT_FOUND,
        isOperational = true,
    ) {
        super(message, status, errors, isOperational);
    }
}

export {
    Api400Error,
    Api401Error,
    Api403Error,
    Api404Error,
    Api409Error,
    BusinessLogicError,
    BaseError,
};
