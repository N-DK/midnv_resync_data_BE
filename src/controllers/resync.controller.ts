import { GET } from '../core/success.response';
import catchAsync from '../helper/catchAsync.helper';
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

    resyncData = catchAsync(async (req: any, res: any) => {
        const { imei } = req.params;
        const { start_time, end_time } = req.query;

        await resyncService.resyncData(imei, start_time, end_time);

        GET(res, 'Resync data success');
    });
}

export default new ResyncController();
