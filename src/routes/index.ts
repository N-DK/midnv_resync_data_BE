import { Express } from 'express';
import resyncRouter from './resync.router';

export default (app: Express) => {
    resyncRouter(app);
};
