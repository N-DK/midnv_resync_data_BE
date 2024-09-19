import DatabaseModel from './database.model';
import { PoolConnection } from 'mysql2';
import { syncBatch } from '../utils/syncBatch';
import { getData } from '../utils/getData';
import getTableName from '../utils/table/getTableName';
import { setting } from '../constants/setting.constant';
import configureEnvironment from '../config/dotenv.config';
import { fork } from 'child_process';
import redisModel from './redis.model';
import fs from 'fs';

const { BATCH_SIZE, TIME_SEND, PROCESS_BATCH_SIZE } = configureEnvironment();

class ResyncModel extends DatabaseModel {
    private number_of_devices_resync: number = 0;

    constructor() {
        super();
    }

    async resyncData(
        con: PoolConnection,
        imei: string,
        start_time = 0,
        end_time = 0,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const { data, device } = await getData(
                    con,
                    imei,
                    this,
                    start_time,
                    end_time,
                );

                const interval = setInterval(async () => {
                    try {
                        console.time(`Time resync data ${imei}`);
                        const batch = data.splice(0, Number(BATCH_SIZE));
                        if (batch.length === 0) {
                            clearInterval(interval);
                            console.timeEnd(`Time resync data ${imei}`);
                            resolve(true);
                            return;
                        }
                        await syncBatch(con, batch, device, this);
                        if (fs.existsSync('./src/common/resync.txt')) {
                            // if file resync.txt exists, read file and resync data and get imei from file
                            const imeis_resync = fs
                                .readFileSync('./src/common/resync.txt', 'utf8')
                                .split('\n');
                            // xóa phần tử imei trong imeis_resync
                            const index = imeis_resync.indexOf(imei);
                            if (index > -1) {
                                imeis_resync.splice(index, 1);
                            }
                            // ghi lại vào file resync.txt
                            fs.writeFileSync(
                                './src/common/resync.txt',
                                imeis_resync.join('\n'),
                            );
                        }
                        console.timeEnd(`Time resync data ${imei}`);
                    } catch (error) {
                        if (!fs.existsSync('./src/common/resync.txt')) {
                            fs.writeFileSync('./src/common/resync.txt', '');
                        }
                        // thêm không trùng imei vào file resync.txt
                        if (
                            !fs
                                .readFileSync('./src/common/resync.txt', 'utf8')
                                .includes(imei)
                        ) {
                            fs.appendFileSync(
                                './src/common/resync.txt',
                                `${imei}\n`,
                            );
                        }
                    }
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

        // get data from resync.txt vào gọi lại hàm resyncData với imeis
        const imeis_resync = fs
            .readFileSync('./src/common/resync.txt', 'utf8')
            .split('\n');
        if (imeis_resync.length > 0) {
            await this.resyncMultipleDevices(con, imeis_resync);
        } else {
            // delete file resync.txt
            fs.unlinkSync('./src/common/resync.txt');
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
