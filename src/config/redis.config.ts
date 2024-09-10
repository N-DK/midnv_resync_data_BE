import configureEnvironment from './dotenv.config';

const { REDIS_HOST, REDIS_PASS, REDIS_PORT } = configureEnvironment();

export default {
    url: `redis://:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`,
};
