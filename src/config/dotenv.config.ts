import dotenv from 'dotenv';

dotenv.config();

const configureEnvironment = () => {
    const nodeEnv = process.env.NODE_ENV || 'development';

    const envPath = `.env.${nodeEnv}`;

    dotenv.config({ path: envPath });

    return process.env;
};

export default configureEnvironment;
