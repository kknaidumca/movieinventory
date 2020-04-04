const logger = require('./../logger/logger');
const mysqlClient = require('./../db/mysqlConnection');
const mysqlDDL = require('./../db/mysql-ddl');
class MovieDao {
    constructor() {
        this.options = {};
    }
    async listMovies() {
        try {
            this.options.query = mysqlDDL.select.listMovies;
            this.options.params = [];
            const movieList = await mysqlClient.query(this.options);
            return movieList;
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    async movieQuery(options) {
        try {
            const movieList = await mysqlClient.query(options);
            return movieList;
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
}
module.exports = new MovieDao();