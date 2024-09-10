import { PoolConnection } from 'mysql2';

export const tableExists = async (db: PoolConnection, tableName: string) => {
    const queryText = `
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?`;
    return new Promise((resolve, reject) => {
        db.query(queryText, [tableName], (err, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].count > 0);
            }
        });
    });
};
