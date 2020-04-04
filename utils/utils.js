const mysqlClient = require('./../db/mysqlConnection');
const calsObject = { 'New releases': { days: 1 }, 'Regular films': { days: 3 }, 'Old films': { days: 5 } };
const logger = require('../logger/logger');
class MovieUtils {
    constructor() {

    }
    async movieOperations(options) {
        try {
            const movieObject = await mysqlClient.query(options);
            return movieObject;
        } catch (err) {
            logger.error(JSON.stringify(err));
            return err;
        }
    }
    calculatePrice(movieDetails, rentObject) {
        try {
            let type = movieDetails.type;
            let days = rentObject.Days;
            let price = 30;
            if (days <= calsObject[type].days) {
                price = movieDetails.price;
            } else {
                price = movieDetails.price;
                price = price + (days - calsObject[type].days) * price;
            }
            return price;

        } catch (err) {
            logger.error(JSON.stringify(err));
            return err;
        }
    }
}
module.exports = new MovieUtils();