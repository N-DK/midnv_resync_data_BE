import { PoolConnection } from 'mysql2';
import { setting } from '../../constants/setting.constant';
import getTableName from './getTableName';
import { tableExists } from './checkTableExists';
import createTable from './createTable';

export const saveTable = async (
    con: PoolConnection,
    deviceId: number,
    time: number,
) => {
    const tableName = getTableName(
        setting.initialNameOfTableGPS,
        deviceId,
        time,
    );
    const isExists = await tableExists(con, tableName);
    if (!isExists) await createTable(con, tableName);
    return tableName;
};
