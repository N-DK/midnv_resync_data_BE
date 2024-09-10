import { getActiveConnections } from '../dbs/init.mysql';
import cron from 'node-cron';
import os from 'os';
import process from 'process';

class IssueTask {
    checkOverload(minute = 15) {
        return cron.schedule(`*/${minute} * * * *`, async function () {
            // console.log("---------------------");
            // console.log("running a task every 10 seconds");
            const numOfConnectDB = await getActiveConnections();
            // console.log("numOfConnectDB", numOfConnectDB);

            const platform = os.platform();
            const totalmem = os.totalmem();

            const numCores = os.cpus().length;
            const memoryUse = process.memoryUsage().rss;
            const versionNode = process.version;

            console.table([
                {
                    versionNode,
                    platform,
                    totalmem: totalmem / 1024 / 1024 / 1024 + ' GB',
                    numCores,
                    memoryUse: memoryUse / 1024 / 1024 + ' MB',
                    numOfConnectDB,
                },
            ]);
        });
    }
}

export default new IssueTask();
