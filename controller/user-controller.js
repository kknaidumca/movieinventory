'use strict';
const joi = require('@hapi/joi');
const logger = require('./../logger/logger');
const userDao = require('./../dao/user-dao');

const getUserSchema = joi.object().keys({
    Username: joi.string().alphanum().min(3).max(30).required()
});

const UserSchema = joi.object().keys({
    Username: joi.string().alphanum().min(3).max(30).required(),
    Type: joi.string().alphanum().min(3).max(30).required(),
    Favorite: joi.string().alphanum().min(3).max(30).required()
});

async function getUserDetails(req, res, next) {
    const userName = req.params.Username;
    try {
        const validate = joi.validate({ Username: userName }, getUserSchema);
        if (!validate.error) {
            let userData = await userDao.userDetails(userName);
            if (userData.length > 0) {
                res.status(200);
                res.send({ isError: false, userDetails: userData });
            } else {
                res.status(200);
                res.send({ isError: true, userDetails: 'No data found for this user!!!' });
            }
        } else {
            res.status(400);
            res.send({ error: validate.error.details[0].message });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}
async function addUserDetails(req, res, next) {
    const userName = req.params.Username;
    const type = req.params.Type;
    const favorite = req.params.Favorite;
    try {
        const validate = joi.validate({ Username: userName, Type: type, Favorite: favorite }, UserSchema);
        if (!validate.error) {
            let userParams = [userName, type, favorite];
            if (!await userDao.isUserExists(userParams)) {
                if (userDao.validateTypeFavorite(type, favorite) >= 1) {
                    let userData = await userDao.addUser(userParams);
                    if (userData.affectedRows > 0) {
                        userData = await userDao.getDetailsById(userData.insertId);
                    }
                    res.status(200);
                    res.send({ isError: false, userDetails: userData });
                } else {
                    res.status(200);
                    res.send({ isError: true, userDetails: 'Invalid Favorite for this Type' });
                }
            } else {
                res.status(200);
                res.send({ isError: true, userDetails: 'User Type and Favorite already Exists.!!' });
            }
        } else {
            res.status(400);
            res.send({ error: validate.error.details[0].message });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}
async function updateUserDetails(req, res, next) {
    const userName = req.params.Username;
    const type = req.params.Type;
    const favorite = req.params.Favorite;
    try {
        const validate = joi.validate({ Username: userName, Type: type, Favorite: favorite }, UserSchema);
        if (!validate.error) {
            //check already same data exists or not
            if (! await userDao.isUserExists([userName, type, favorite])) {
                let userFavorites = await userDao.getByNameAndType([userName, type]);
                if (userFavorites.length > 0) {
                    if (userDao.validateTypeFavorite(type, favorite) >= 1) {
                        let userParams = [favorite, userName, type];
                        let userData = await userDao.updateUser(userParams);
                        if (userData.affectedRows >= 1) {
                            userData = await userDao.getUpdatedUser([userName, type, favorite]);
                        }
                        res.status(200);
                        res.send({ isError: false, userDetails: userData });
                    } else {
                        res.status(200);
                        res.send({ isError: true, userDetails: 'Invalid Favorite for this Type' });
                    }
                } else {
                    res.status(200);
                    res.send({ isError: true, userDetails: 'No data to update' });
                }
            } else {
                res.status(200);
                res.send({ isError: true, userDetails: 'user has already updated with this data' });
            }
        } else {
            res.status(400);
            res.send({ error: validate.error.details[0].message });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}
async function deleteUserDetails(req, res, next) {

    const userName = req.params.Username;
    const type = req.params.Type;
    const favorite = req.params.Favorite;
    try {
        const validate = joi.validate({ Username: userName, Type: type, Favorite: favorite }, UserSchema);
        if (!validate.error) {
            //check already same data exists or not
            if (await userDao.isUserExists([userName, type, favorite])) {
                let deleteStatus = await userDao.deleteUser([userName, type, favorite]);
                if (deleteStatus.affectedRows >= 1) {
                    res.status(200);
                    res.send({ isError: false, userDetails: 'User Deleted Successfully.' });
                } else {
                    res.status(200);
                    res.send({ isError: true, userDetails: 'Failed To delete user' });
                }
            } else {
                res.status(200);
                res.send({ isError: true, userDetails: 'No data found for this user' });
            }
        } else {
            res.status(400);
            res.send({ error: validate.error.details[0].message });
        }
    } catch (err) {
        logger.error(err);
        next(err);
    }
}
module.exports = {
    getUserDetails: getUserDetails,
    addUserDetails: addUserDetails,
    updateUserDetails: updateUserDetails,
    deleteUserDetails: deleteUserDetails
};