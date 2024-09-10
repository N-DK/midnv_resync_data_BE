import { Response } from 'express';
import constants from '../constants/msg.constant';
const { StatusCodes } = require('./httpStatusCode');

class SuccessResponse {
    result: boolean;
    message: string;
    status: number;
    data: any;

    totalPage: number | undefined;
    totalRecord: number | undefined;
    options: any;

    constructor({
        message = '',
        status = StatusCodes.OK,
        data = {},
        options = {},
        totalPage = -1,
        totalRecord = -1,
    }) {
        this.result = true;
        this.message = message;
        this.status = status;
        if (totalPage >= 0) {
            this.totalPage = totalPage;
            this.totalRecord = totalRecord;
        }
        this.data = data;
        this.options = options;
    }

    send(res: Response, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class Create extends SuccessResponse {
    constructor({ data = {}, options = {}, message = '' }) {
        super({ message, status: StatusCodes.CREATED, data, options });
    }
}

class Update extends SuccessResponse {
    constructor({ data = {}, options = {}, message = '' }) {
        super({ message, data, options });
    }
}

class Get extends SuccessResponse {
    constructor({
        data = {},
        totalPage = 0,
        totalRecord = 0,
        options = {},
        message = '',
    }) {
        super({
            message,
            status: StatusCodes.OK,
            data,
            options,
            totalPage,
            totalRecord,
        });
    }
}

class Delete extends SuccessResponse {
    constructor({ data = {}, options = {}, message = '' }) {
        super({ message, status: StatusCodes.OK, data, options });
    }
}

class Ok extends SuccessResponse {
    constructor({ data = {}, options = {}, message = '' }) {
        super({ message, status: StatusCodes.OK, data, options });
    }
}

const CREATED = (
    res: Response,
    data: any,
    options = {},
    message = constants.ADD_DATA_SUCCESS,
) => {
    new Create({
        message,
        data,
        options,
    }).send(res);
};

const UPDATE = (
    res: Response,
    data: any,
    options = {},
    message = constants.UPDATE_DATA_SUCCESS,
) => {
    new Update({
        message,
        data,
        options,
    }).send(res);
};

const GET = (
    res: Response,
    data: any,
    totalPage = 0,
    totalRecord = 0,
    options = {},
    message = constants.GET_DATA_SUCCESS,
) => {
    new Get({
        message,
        data,
        totalPage,
        totalRecord,
        options,
    }).send(res);
};

const DELETE = (
    res: Response,
    data: any,
    options = {},
    message = constants.DELETE_DATA_SUCCESS,
) => {
    new Delete({
        message,
        data,
        options,
    }).send(res);
};

const OK = (
    res: Response,
    data: any,
    options = {},
    message = constants.LOGIN_SUCCESS,
) => {
    new Ok({
        message,
        data,
        options,
    }).send(res);
};
export { GET, UPDATE, CREATED, DELETE, OK };
