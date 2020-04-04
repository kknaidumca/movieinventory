'use strict';
const mysql = require('mysql');
const mysqlConnectionOption = require('../config/config').database.mysql;
const util = require('util');
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
    async query(options) {
        try {
            let conn = this.getConnection();
            const query = util.promisify(conn.query).bind(conn);
            let rows = await query(options.query, options.params);
            conn.end();
            return rows;
        } catch (error) {
            console.error(error);
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