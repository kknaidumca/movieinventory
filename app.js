'use strict';
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const logger = require('./logger/logger');
const config = require('./config/config');
const userRoutes = require('./routes/user-routes');

// added swagger module
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const basePath = '/api/v1/';

let host = config.app_host;
const swaggerDefinition = {
    info: {
        title: 'Sample Restful API',
        version: '1.0.1',
        description: 'Sample Restful API with Swagger',
    },
    host,
    basePath: basePath,
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header',
        },
    }
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);
// swagger start
app.use(basePath + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// swagger end

app.use(express.json());
app.use(compression());
app.use(cors({}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(helmet());


//for swagger
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Authorization');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Accept', 'application/json');
    next();
});
// redirect to swagger api docs
app.get([basePath, '/'], (req, res) => res.redirect(basePath + 'api-docs'));
// Route All CURD operations
app.use(basePath, cors(), userRoutes);

/********* error handlers **************/

app.use(notFoundErrors);
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

function notFoundErrors(req, res, next) {
    res.status(404);
    res.format({
        json: function () {
            res.json({
                status: "error",
                code: 404,
                error: `${req.url} 'Not Found'`
            })
        },
        default: function () {
            res.type('txt').send('Not found')
        }
    });
    next();
}

function logErrors(err, req, res, next) {
    logger.error(`url:'${req.url}'  ${JSON.stringify(err)}`);
    next(err)
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500);
        res.json({
            'status': 'error',
            "code": 500,
            "message": "oops Some thing went wrong Server",
            "description": err
        })
    } else {
        next(err)
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.json({
        'status': 'error',
        "code": 500,
        "message": "error in server",
        "description": err
    });
    next();
}
module.exports = app;