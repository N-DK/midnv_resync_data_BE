import { createClient, RedisClientType } from 'redis';
import redisConfig from '../config/redis.config';

let client: { instanceConnect?: RedisClientType } = {},
    statusConnectRedis = {
        CONNECT: 'connect',
        END: 'end',
        RECONNECTING: 'reconnecting',
        ERROR: 'error',
    };

const handleEventConnection = async (connection: RedisClientType) => {
    try {
        connection.on(statusConnectRedis.CONNECT, () => {
            console.log('connectRedis - status: connected');
        });

        connection.on(statusConnectRedis.END, () => {
            console.log('connectRedis - status: connection closed');
        });

        connection.on(statusConnectRedis.RECONNECTING, (attempt) => {
            console.log(
                `connectRedis - status: reconnecting, attempt: ${attempt}`,
            );
        });

        connection.on(statusConnectRedis.ERROR, (err) => {
            console.log(`connectRedis - status: error ${err}`);
        });
        await connection.connect();
    } catch (error) {
        console.log('error redis::::', error);
    }
};

class Redis {
    async init() {
        try {
            const instanceRedis: RedisClientType = createClient({
                ...redisConfig,
                socket: {
                    reconnectStrategy: function (retries) {
                        return Math.min(retries * 500, 10000);
                    },
                },
            });

            client.instanceConnect = instanceRedis;

            handleEventConnection(instanceRedis);
        } catch (error) {
            console.log({ error });
        }
    }

    get() {
        try {
            return client;
        } catch (error) {
            console.log(error);
        }
    }

    close() {
        if (client.instanceConnect) {
            client.instanceConnect.quit();
        }
    }
}

const { init, get, close } = new Redis();

export { init as initRedis, get as getRedis, close as closeRedis };
