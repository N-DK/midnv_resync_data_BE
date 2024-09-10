import mysql, { PoolConnection, PoolOptions, QueryResult } from 'mysql2';
import dbConfig from '../config/db.config';
import constants from '../constants/msg.constant';

const pool = mysql.createPool(dbConfig as PoolOptions);

class Database {
    async getConnection(): Promise<{ conn: PoolConnection; connPromise: any }> {
        return await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) {
                    return reject({ msg: constants.SERVER_ERROR });
                }
                resolve({ conn, connPromise: conn.promise() });
            });
        });
    }

    init() {
        pool.getConnection(function (err, conn) {
            if (err) {
                return console.log('error when connecting to Database', err);
            } else {
                console.log(
                    `SUCCESS:: CONNECTED TO DATABASE >> ${dbConfig.host}`,
                );
                conn.release();
            }
        });
    }
    async getActiveConnections() {
        return await new Promise(async (resolve, reject) => {
            const { conn: connection } = await getConnection();
            const query =
                'SELECT COUNT(*) AS connection_count FROM information_schema.PROCESSLIST';

            connection.query(query, (err: any, results: any) => {
                connection.release();
                if (err) {
                    console.error('Lỗi truy vấn SQL của count connect:', err);
                    return reject(err);
                }
                // console.log("result count connect", results);
                const connectionCount = results[0].connection_count;
                return resolve(connectionCount);
            });
        });
    }
}

const { getConnection, init, getActiveConnections } = new Database();

export { getConnection, pool, init as initDB, getActiveConnections };
