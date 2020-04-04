'use strict';
const joi = require('@hapi/joi');
const logger = require('./../logger/logger');
const MovieDAO = require('../dao/movie-dao');
const mysqlDDL = require('./../db/mysql-ddl');
const MovieUtils = require('../utils/utils');
const respMessage = { isError: true, message: 'Failed get movie list' };
const moviePrices = { 'New releases': 40, 'Regular films': 30, 'Old films': 30 };
class MovieController {
    constructor() {
        this.options = {};
    }
    async listMovies(req, res) {
        const list = await MovieDAO.listMovies();
        if (list) {
            res.json(list);
        } else {
            res.status(500).send(respMessage);
        }
    }
    async listAvialableMovies(req, res) {
        const options = {};
        options.query = mysqlDDL.select.listAvialableMovies;
        options.params = [];
        const avialableMovies = await MovieDAO.movieQuery(options);
        if (avialableMovies) {
            res.json(avialableMovies);
        } else {
            res.status(500).send(respMessage);
        }
    }
    async addNewMovie(req, res) {
        const movieName = req.params.MovieName;
        const movieType = req.params.Type;
        const MovieSchema = joi.object().keys({
            name: joi.string().min(3).max(30).required(),
            type: joi.string().min(3).max(30).required()
        });
        const validate = joi.validate({ name: movieName, type: movieType }, MovieSchema);
        if (!validate.error) {
            const options = {};
            options.query = mysqlDDL.select.isMovieExists;
            options.params = [movieName.toLowerCase()];
            let movieExists = await MovieUtils.movieOperations(options);
            if (movieExists && movieExists.length > 0) {
                movieExists = movieExists[0].moviecount;
                if (movieExists == 0) {
                    //Insert to Database
                    options.query = mysqlDDL.insert.addMovie;
                    options.params = [movieName.toLowerCase(), movieType, 1, moviePrices[movieType]];
                    let movieInsert = await MovieDAO.movieQuery(options);
                    if (movieInsert && movieInsert.affectedRows > 0) {
                        logger.info(JSON.stringify(movieInsert));
                        respMessage.isError = false;
                        respMessage.message = 'Movie Added Successfully.'
                        res.json(respMessage);
                    } else {
                        respMessage.isError = true;
                        respMessage.message = 'Failed to add Movie!'
                        res.status(500).send(respMessage);
                    }
                } else {
                    respMessage.isError = false;
                    respMessage.message = 'Movie Already Exists'
                    res.status(200).send(respMessage);
                }
            } else {
                logger.info(JSON.stringify(movieExists));
                respMessage.message = 'Failed to add Movie!'
                res.status(500).send(respMessage);
            }

        } else {
            respMessage.message = 'Failed To add Movie';
            res.status(500).send(respMessage);
        }
    }
    async changeTypeOfMovie(req, res) {
        const movieName = req.params.MovieName;
        const movieType = req.params.Type;
        const MovieSchema = joi.object().keys({
            name: joi.string().min(3).max(30).required(),
            type: joi.string().min(3).max(30).required()
        });
        const validate = joi.validate({ name: movieName, type: movieType }, MovieSchema);
        if (!validate.error) {
            const options = {};
            options.query = mysqlDDL.select.isMovieExists;
            options.params = [movieName.toLowerCase()];
            let movieExists = await MovieUtils.movieOperations(options);
            if (movieExists && movieExists.length > 0) {
                movieExists = movieExists[0].moviecount;
                if (movieExists > 0) {
                    options.query = mysqlDDL.update.updateMovieType;
                    options.params = [movieType, moviePrices[movieType], movieName.toLowerCase()];
                    let updateType = await MovieDAO.movieQuery(options);
                    if (updateType && updateType.affectedRows > 0) {
                        respMessage.isError = false;
                        respMessage.message = 'Movie type updated successfully.'
                        res.status(200).send(respMessage);
                    } else {
                        respMessage.isError = true;
                        respMessage.message = 'Failed to update Movie Type!'
                        res.status(200).send(respMessage);
                    }
                } else {
                    respMessage.isError = true;
                    respMessage.message = 'Movie does not Exists'
                    res.status(200).send(respMessage);
                }
            } else {
                respMessage.isError = true;
                respMessage.message = 'Movie does not Exists'
                res.status(200).send(respMessage);
            }
        } else {
            respMessage.message = 'Invalid parameters';
            res.status(500).send(respMessage);
        }
    }
    async removeMovie(req, res) {
        const movieName = req.params.MovieName;
        const MovieSchema = joi.object().keys({
            name: joi.string().min(3).max(30).required()
        });
        const validate = joi.validate({ name: movieName }, MovieSchema);
        if (!validate.error) {
            const options = {};
            options.query = mysqlDDL.select.isMovieExists;
            options.params = [movieName.toLowerCase()];
            let movieExists = await MovieUtils.movieOperations(options);
            if (movieExists && movieExists.length > 0) {
                movieExists = movieExists[0].moviecount;
                if (movieExists > 0) {
                    options.query = mysqlDDL.delete.deleteMovie;
                    options.params = [movieName.toLowerCase()];
                    let movieDelete = await MovieDAO.movieQuery(options);
                    if (movieDelete && movieDelete.affectedRows > 0) {
                        respMessage.isError = false;
                        respMessage.message = 'Movie Deleted Successfully';
                        res.status(200).send(respMessage);
                    }
                } else {
                    respMessage.isError = true;
                    respMessage.message = 'Movie Does not exists';
                    res.status(200).send(respMessage);
                }
            } else {
                respMessage.isError = true;
                respMessage.message = 'Movie Does not exists';
                res.status(200).send(respMessage);
            }
        } else {
            respMessage.message = 'Invalid parameters';
            res.status(500).send(respMessage);
        }
    }
    async rentMovie(req, res) {
        const rentObject = req.body;
        const req_body_schema = joi.object().keys({
            MovieName: joi.string().min(3).max(30).required(),
            Days: joi.number().min(1).max(999).required(),
            CustomerName: joi.string().min(2).max(45).required(),
            useBonus: joi.boolean().required()
        });
        const validate = joi.validate(rentObject, req_body_schema);
        if (!validate.error) {
            const options = {};
            options.query = mysqlDDL.select.isMovieExists;
            options.params = [rentObject.MovieName.toLowerCase()];
            let movieExists = await MovieUtils.movieOperations(options);
            if (movieExists && movieExists.length > 0) {
                movieExists = movieExists[0].moviecount;
                if (movieExists > 0) {
                    options.query = mysqlDDL.select.movieDetails;
                    options.params = [rentObject.MovieName.toLowerCase()];
                    let movieDetails = await MovieUtils.movieOperations(options);
                    if (movieDetails && movieDetails.length > 0) {

                        let price = MovieUtils.calculatePrice(movieDetails[0], rentObject);
                        let bonus = (movieDetails[0].type == 'New releases') ? 2 : 1
                        options.query = mysqlDDL.insert.insertToCustomer;
                        options.params = [rentObject.CustomerName, rentObject.MovieName.toLowerCase(), movieDetails[0].type, price, bonus];
                        await MovieUtils.movieOperations(options);

                        options.query = mysqlDDL.update.updateRentStatus;
                        options.params = [rentObject.MovieName.toLowerCase()];
                        let renetedStatus = await MovieUtils.movieOperations(options);
                        
                        logger.info(JSON.stringify(renetedStatus));
                        const rentResObject = {};
                        rentResObject.moviename = rentObject.MovieName;
                        rentResObject.type = movieDetails[0].type;
                        rentResObject.days = rentObject.Days;
                        rentResObject.price = price + ' EUR';
                        res.send(rentResObject);
                    } else {
                        respMessage.isError = true;
                        respMessage.message = 'Movie Alreay rented';
                        res.status(200).send(respMessage);
                    }

                } else {
                    respMessage.isError = true;
                    respMessage.message = 'Movie Does not exists!!';
                    res.status(200).send(respMessage);
                }
            }
        } else {
            respMessage.message = 'Invalid Parameters'
            res.status(200).send(respMessage);
        }
    }
    trackBonus() {

    }
}
module.exports = MovieController;