const logger = require('./../logger/logger');
const mysqlClient = require('./../db/mysqlConnection');
const mysqlDDL = require('./../db/mysql-ddl');
const userTypeFavorite = [{ type: 'movie', favorite: 'action' }, { type: 'movie', favorite: 'drama' }, { type: 'food', favorite: 'indian' }, { type: 'food', favorite: 'chinese' }];
function userDetails(userName) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.select.getUserDetailsByName, userName, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function addUser(userData) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.insert.addUser, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function updateUser(userData) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.update.updateUser, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function deleteUser(userData) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.delete.deleteUser, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function isUserExists(userData) {
    return new Promise((resolve, reject) => {
        let isExists = false;
        mysqlClient.query(mysqlDDL.select.isUserExists, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                if (rows[0].rowcount > 0) {
                    isExists = true;
                }
                return resolve(isExists);
            }
        })
    });
}
function getDetailsById(userID) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.select.getUserById, userID, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function getByNameAndType(userData) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.select.getUserByNameType, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
function validateTypeFavorite(type, favorite) {
    let isValid = 0;
    userTypeFavorite.forEach((currentObj) => {
        if (currentObj.type === type.toLowerCase() && currentObj.favorite === favorite.toLowerCase()) {
            isValid = isValid + 1;
        }
    });
    return isValid;
}
function getUpdatedUser(userData) {
    return new Promise((resolve, reject) => {
        mysqlClient.query(mysqlDDL.select.updatedUser, userData, (err, rows) => {
            if (err) {
                logger.error(JSON.stringify(err));
                return reject(err);
            } else {
                return resolve(rows);
            }
        })
    });
}
module.exports = {
    userDetails: userDetails,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    isUserExists: isUserExists,
    getDetailsById: getDetailsById,
    getByNameAndType: getByNameAndType,
    validateTypeFavorite: validateTypeFavorite,
    getUpdatedUser: getUpdatedUser
}