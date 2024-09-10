import http from 'http';
import process from 'process';
import app from './src/app';
import configureEnvironment from './src/config/dotenv.config';

const { PORT: PORT_ENV, NODE_ENV, DOMAIN_NAME } = configureEnvironment();
console.log('environment ::::', NODE_ENV);

const PORT = PORT_ENV || 3055;

// start server nodejs
const server = http.createServer(app).listen(PORT, () => {
    console.log(`Domain server :::: ${DOMAIN_NAME}:${PORT}`);
});

// const task = require("./src/tasks/issure.task");
process.on('SIGINT', () => {
    // task.checkOverload().stop();
    server.close(() => console.log('Exit server express'));
    process.exit();

    // notify send (ping....)
});
