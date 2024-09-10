import resyncService from '../services/resync.service';

const imei = process.argv[2];

(async () => {
    try {
        console.log(`Bắt đầu resync cho IMEI: ${imei}`);
        await resyncService.resyncData(imei);
        console.log(`Resync thành công cho IMEI: ${imei}`);
        process.exit(0);
    } catch (error: any) {
        console.error(`Resync thất bại cho IMEI: ${imei}:`, error.message);
        process.exit(1);
    }
})();
