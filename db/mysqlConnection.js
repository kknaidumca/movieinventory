'use strict';
const mysql = require('mysql');
const mysqlConnectionOption = require('../config/config').database.mysql;
/*
 * @sqlConnection
 * Creates the connection, makes the query and close it to avoid concurrency conflicts.
 */
class Database {
    constructor() {
    }
    getConnection(multipleStatements = false) {
        if (multipleStatements) mysqlConnectionOption.multipleStatements = true
        let connection = mysql.createConnection(mysqlConnectionOption);
        connection.connect();
        return connection;
    }
    query(options, params, callback) {
        try {
            let conn = this.getConnection();
            conn.query(options, params, (err, rows) => {
                conn.end()
                callback(err, rows)
            });
        } catch (error) {
            callback(error, null)
        }
    }
    multipleQuery(options, callback) {
        try {
            let conn = this.getConnection(true);
            conn.query(options, (err, rows) => {
                conn.end()
                callback(err, rows)
            });
        } catch (error) {
            callback(error, null)
        }
    }
}
module.exports = new Database();