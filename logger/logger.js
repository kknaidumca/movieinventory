'use strict';
const {
    createLogger,
    format,
    transports
} = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');
const config = require('./../config/config');

const timeFormate = format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss:SSS'
});
const env = process.env.NODE_ENV || 'development';
const pathDir = `../../${config.appLogggerDirectory || process.env.appLogggerDirectory}`;
var logDir = path.join(__dirname, pathDir);

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
logDir = logDir + '/apis';
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%/apis.log`,
    datePattern: 'YYYY-MM-DD'
});


const logger = createLogger({
    level: env === ('development' || 'dev' || 'local') ? 'debug' : 'error',
    json: true,
    format: format.combine(
        timeFormate,
        format.printf(
            info => `${info.timestamp} : ${info.level} : ${info.message}`
        )),
    transports: [
        new transports.File({
            level: 'error',
            handleExceptions: false,
            filename: `${logDir}/error.log`,
            json: true,
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} : ${info.message}`
                )
            )
        }),
        new transports.Console({
            level: env === ('development' || 'dev' || 'local') ? 'debug' : 'error',
            handleExceptions: true,
            json: false,
            format: format.combine(
                format.colorize(),
                timeFormate,
                format.printf(
                    info => `${info.level}  : ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ],
    exceptionHandlers: [
        new transports.File({
            filename: `${logDir}/exceptions.log`
        })
    ],
    exitOnError: false

});
logger.info("Logger Directory ::-- " + logDir);
module.exports = logger;