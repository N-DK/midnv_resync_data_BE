import express, { Express, Router } from 'express';
import { body, query, param } from 'express-validator';
import constants from '../constants/msg.constant';
import resyncController from '../controllers/resync.controller';

const router: Router = express.Router();

router.get(
    '/get-data/:imei',
    [
        param('imei', constants.VALIDATE_DATA).isString(),
        query('start_date', constants.VALIDATE_DATA).isNumeric(),
        query('end_date', constants.VALIDATE_DATA).isNumeric(),
    ],
    resyncController.getData,
);

export default (app: Express) => {
    app.use('/api/v1/resync', router);
};
