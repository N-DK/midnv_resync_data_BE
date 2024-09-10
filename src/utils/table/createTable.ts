import { PoolConnection } from 'mysql2';

const createTable = async (db: PoolConnection, tableName: string) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            idx int(11) NOT NULL,
            imei varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            license_number varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
            latitude double NOT NULL,
            longitude double NOT NULL,
            speed double NOT NULL,
            min_speed double DEFAULT NULL,
            max_speed double DEFAULT NULL,
            signal_quality int(11) NOT NULL,
            rotation double NOT NULL,
            status int(11) NOT NULL,
            status_device int(11) DEFAULT NULL,
            distance double DEFAULT NULL,
            total_distance double DEFAULT NULL,
            acc int(11) NOT NULL,
            io int(11) NOT NULL,
            syn int(11) NOT NULL,
            time bigint(20) NOT NULL,
            is_error_insert tinyint(1) NOT NULL,
            is_error_address tinyint(1) NOT NULL,
            address text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            created_at bigint(20) NOT NULL,
            updated_at bigint(20) DEFAULT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY imei (imei,time),
            KEY license_number (license_number)
        )`;

    try {
        db.query(createTableQuery, (err) => {
            if (err) {
                throw new Error(
                    `Failed to create table ${tableName}: ${err.message}`,
                );
            }
        });
    } catch (err: any) {
        throw new Error(`Failed to create table ${tableName}: ${err.message}`);
    }
};

export default createTable;
