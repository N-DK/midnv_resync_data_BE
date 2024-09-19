import axios from 'axios';
import { PoolConnection } from 'mysql2';
import DatabaseModel from '../models/database.model';
import { tables } from '../constants/tableName.constant';
import { formatData } from './formatData';
import fs from 'fs';

export const getData = async (
    con: PoolConnection,
    imei: string,
    databaseModel: DatabaseModel,
    start_time = 0,
    end_time = 0,
) => {
    try {
        // Fetch data from API
        const response: any = await axios.get(
            `http://njnjcnxc.taixecongnghe.com:9989/download?file=${imei}`,
        );

        // const response: string = fs.readFileSync(
        //     `./src/common/${imei}.txt`,
        //     'utf8',
        // ); // Mock data

        let rawData: string = response?.data;

        // Convert rawData to a string if it's an object
        if (typeof rawData === 'object') {
            rawData = JSON.stringify(rawData);
        }

        const fileSizeInBytes = Buffer.byteLength(rawData, 'utf8');
        const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
        console.log(
            `fileSizeInMegabytes of ${imei}: ${fileSizeInMegabytes} MB`,
        );

        if (!rawData) throw new Error('No data received from API.');

        // Process and parse the data
        let data = rawData
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((jsonString) => {
                try {
                    return JSON.parse(jsonString);
                } catch (error) {
                    console.error('Failed to parse JSON:', error);
                    return null; // or handle this error as needed
                }
            })
            .filter((item) => item !== null); // Filter out null values from failed parsing

        // Check if the device exists in the database
        const device: any = await databaseModel.select(
            con,
            tables.tableDevice,
            'id',
            'imei = ?',
            [imei],
        );
        if (!device.length) throw new Error('Device not found.');

        // Format the data
        data = await formatData(data);

        // tìm items trong data khoảng start_time đến end_time
        console.log('start_time: ', start_time);
        console.log('end_time: ', end_time);

        if (start_time > 0 && end_time > 0) {
            data = data.filter(
                (item: any) => item.time >= start_time && item.time <= end_time,
            );
        }
        return { data, device };
    } catch (error) {
        console.error('Error in getData function:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
