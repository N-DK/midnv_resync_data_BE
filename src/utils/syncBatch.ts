import axios from 'axios';
import { saveTable } from './table/saveTable';
import { PoolConnection } from 'mysql2';
import DatabaseModel from '../models/database.model';
import { FILED_TBL_GPS } from '../constants/setting.constant';
import configureEnvironment from '../config/dotenv.config';

const { MAP_SERVER } = configureEnvironment();

export const syncBatch = async (
    con: PoolConnection,
    batch: any[],
    device: any,
    databaseModel: DatabaseModel,
) => {
    try {
        await Promise.all(
            batch.map(async (item) => {
                const { data: speedData = {} } = await axios.get(
                    `${MAP_SERVER}/api/v1/check-way?lat=${item.latitude}&lng=${item.longitude}`,
                );

                item.max_speed = speedData.max_speed;
                item.min_speed = speedData.min_speed;

                const tableName = await saveTable(
                    con,
                    device[0].id,
                    item.time * 1000,
                );

                await databaseModel.insertIgnore(
                    con,
                    tableName,
                    FILED_TBL_GPS,
                    Object.values(item),
                );
            }),
        );
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};
