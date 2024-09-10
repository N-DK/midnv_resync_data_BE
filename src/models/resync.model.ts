import DatabaseModel from './database.model';
import { PoolConnection } from 'mysql2';
import { syncBatch } from '../utils/syncBatch';
import { getData } from '../utils/getData';
import getTableName from '../utils/table/getTableName';
import { setting } from '../constants/setting.constant';
import configureEnvironment from '../config/dotenv.config';
import { fork } from 'child_process';
import redisModel from './redis.model';

const { BATCH_SIZE, TIME_SEND, PROCESS_BATCH_SIZE } = configureEnvironment();

class ResyncModel extends DatabaseModel {
    private number_of_devices_resync: number = 0;

    constructor() {
        super();
    }

    async resyncData(con: PoolConnection, imei: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const { data, device } = await getData(con, imei, this);

                const interval = setInterval(async () => {
                    console.time(`Time resync data ${imei}`);
                    const batch = data.splice(0, Number(BATCH_SIZE));
                    if (batch.length === 0) {
                        clearInterval(interval);
                        console.timeEnd(`Time resync data ${imei}`);
                        resolve(true);
                        return;
                    }
                    await syncBatch(con, batch, device, this);
                    console.timeEnd(`Time resync data ${imei}`);
                }, Number(TIME_SEND));
            } catch (error: any) {
                console.error('Error resync data: ', error.message);
                reject(error);
            }
        });
    }

    // async resyncMultipleDevices(con: PoolConnection, imeis: string[]) {
    //     console.time(`Time resync multiple devices ${imeis}`);

    //     await Promise.all(imeis.map((imei) => this.runChildProcess(imei)));

    //     try {
    //         const { data } = await redisModel?.get(
    //             'number_of_devices_resync',
    //             './src/model/resync.model.ts',
    //             1,
    //         );

    //         this.number_of_devices_resync = Number(data) || 0;

    //         const updatedCount = this.number_of_devices_resync + imeis.length;

    //         const res = await redisModel.setWithExpired(
    //             'number_of_devices_resync',
    //             `${updatedCount}`,
    //             60 * 60 * 24,
    //             './src/model/resync.model.ts',
    //             Date.now(),
    //         );

    //         this.number_of_devices_resync = updatedCount;

    //         console.timeEnd(`Time resync multiple devices ${imeis}`);
    //     } catch (error) {
    //         console.error('Error handling Redis operations:', error);
    //     }
    // }

    async resyncMultipleDevices(con: PoolConnection, imeis: string[]) {
        const BATCH_SIZE = 8;
        const imeiGroups = [];

        for (let i = 0; i < imeis.length; i += BATCH_SIZE) {
            imeiGroups.push(imeis.slice(i, i + BATCH_SIZE));
        }

        for (const group of imeiGroups) {
            console.time(`Time resync multiple devices ${group}`);
            await Promise.all(group.map((imei) => this.runChildProcess(imei)));
            try {
                const { data } = await redisModel.hGet(
                    'number_of_devices_resynced',
                    `number_of_devices_resynced_${PROCESS_BATCH_SIZE}`,
                    'app.ts',
                    Date.now(),
                );

                this.number_of_devices_resync =
                    Number(data) || Number(PROCESS_BATCH_SIZE);

                const updatedCount =
                    this.number_of_devices_resync + group.length;

                await redisModel.hSet(
                    'number_of_devices_resynced',
                    `number_of_devices_resynced_${PROCESS_BATCH_SIZE}`,
                    `${updatedCount}`,
                    './src/model/resync.model.ts',
                    Date.now(),
                );

                this.number_of_devices_resync = updatedCount;

                console.timeEnd(`Time resync multiple devices ${group}`);
            } catch (error) {
                console.error('Error handling Redis operations:', error);
            }
        }
    }

    async runChildProcess(imei: string) {
        return new Promise(async (resolve, reject) => {
            const child = fork('./src/utils/resyncWorker.ts', [imei]);

            child.on('exit', (code) => {
                if (code === 0) {
                    resolve(true);
                } else {
                    reject(
                        new Error(
                            `Process exited with code ${code} for IMEI: ${imei}`,
                        ),
                    );
                }
            });

            child.on('error', (error) => {
                console.error(
                    `Lỗi trong child process cho IMEI: ${imei}`,
                    error,
                );
                reject(error);
            });
        });
    }

    async getData(con: PoolConnection, params: any, query: any) {
        try {
            const { imei } = params;
            const { start_date, end_date } = query;

            const { device } = await getData(con, imei, this);

            const tableName = getTableName(
                setting.initialNameOfTableGPS,
                device[0].id,
                start_date * 1000,
            );

            const data = await this.select(
                con,
                tableName,
                '*',
                'latitude IS NOT NULL AND longitude IS NOT NULL AND time >= ? AND time <= ?',
                [start_date, end_date],
                'id',
                'DESC',
                0,
                9999999,
            );

            return data;
        } catch (error: any) {
            console.error('Error get data: ', error.message);
        }
    }
}

export default new ResyncModel();
