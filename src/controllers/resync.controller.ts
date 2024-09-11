import { GET } from '../core/success.response';
import resyncService from '../services/resync.service';

class ResyncController {
    async getData(req: any, res: any) {
        try {
            const params = req.params;
            const query = req.query;
            const data = await resyncService.getData(params, query);

            GET(res, data);
        } catch (error) {}
    }

    async resyncData(req: any, res: any) {
        try {
            const { imei } = req.params;
            await resyncService.resyncData(imei);

            GET(res, 'Resync data success');
        } catch (error) {}
    }
}

export default new ResyncController();
