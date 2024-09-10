import configureEnvironment from './dotenv.config';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_PR_CHARSET } =
    configureEnvironment();

export default {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    charset: DB_PR_CHARSET,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 500,
    queueLimit: 1000,
};
