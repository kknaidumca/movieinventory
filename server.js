'use strict';
const http = require('http');
const util = require('util');
const app = require('./app');
const config = require('./config/config');
const logger = require('./logger/logger');
const server = http.createServer(app);
const port = config.app_port;
server.listen(port, () => { });

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    // handle specific listen errors with friendly messages from here
    switch (error.code) {
        case 'EACCES':
            logger.error(' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error('port already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    logger.info("************SERVER STARTED **********************");
}

process.on('unhandledRejection', (reason, description) => {
    logger.error(`unhandledRejection, reason:${reason} Error:${JSON.stringify(description)}`);
    exit();
});

process.on('uncaughtException', err => {
    logger.error(`uncaughtException code:${err.code} message:${err.details} trace:${JSON.stringify(err)}`);
    // Close current server
    exit();
});

process.on('exit', function (code) {
    exit(code);
});

process.on('SIGINT', (err) => { // Handle CTRL+C
    logger.error(`SIGINT, error:${JSON.stringify(err)}`);
    exit();
});

function exit(code = 0) {
    logger.error(`server stoped processId:${process.pid} code:${code} processUpTime:${process.uptime()} memmoryUsed:${JSON.stringify(util.inspect(process.memoryUsage()))}`);
    process.exit(code);
}
