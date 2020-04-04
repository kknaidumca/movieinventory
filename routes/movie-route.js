'use strict';
const express = require("express");
const router = express.Router();
const MovieController = require('./../controller/movie-controller');
const moiveIns = new MovieController();
/**
 * @swagger
 * /get/listMovies:
 *   get:
 *     tags:
 *       - Movie Rental Store
 *     produces:
 *       - application/json  
 *     responses:
 *       200:
 *         description: Movie List
 *         examples:
 *           application/json:
 *              [{
 *               "Name": "Matrix 11",
 *               "Type": "New release",
 *               "Price": "40 EUR"
 *              }]         
 */
router.get('/get/listMovies', moiveIns.listMovies);
/**
 * @swagger
 * /get/listAvialableMovies:
 *   get:
 *     tags:
 *       - Movie Rental Store
 *     produces:
 *       - application/json  
 *     responses:
 *       200:
 *         description: Avialable Movie List
 *         examples:
 *           application/json:
 *              [{
 *               "Name": "Matrix 11",
 *               "Type": "New release",
 *               "Price": "40 EUR"
 *              }]         
 */
router.get('/get/listAvialableMovies', moiveIns.listAvialableMovies);

/**
 * @swagger
 * /add/{MovieName}/{Type}:
 *   post:
 *     parameters:
 *      - name: MovieName
 *        description: Enter Movie Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *      - name: Type
 *        description: Select Type
 *        enum: ["New releases", "Regular films", "Old films"]
 *        in: path
 *        required: true   
 *     tags:
 *       - Movie Rental Store
 *     description: Enter the Movie details
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Add Movie
 *         examples:
 *           application/json:
 *              {
 *              "isError": false,
 *               "message": "Movie Added Successfully."
 *              }         
 */
router.post('/add/:MovieName/:Type', moiveIns.addNewMovie);
/**
 * @swagger
 * /change/{MovieName}/{Type}:
 *   put:
 *     parameters:
 *      - name: MovieName
 *        description: Enter Movie Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *      - name: Type
 *        description: Select Type
 *        enum: ["New releases", "Regular films", "Old films"]
 *        in: path
 *        required: true   
 *     tags:
 *       - Movie Rental Store
 *     description: Enter the Movie details
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Change Movie Type
 *         examples:
 *           application/json:
 *              {
 *               "isError": false,
 *               "message": "Movie type changeed Successfully."
 *              }         
 */
router.put('/change/:MovieName/:Type', moiveIns.changeTypeOfMovie);
/**
 * @swagger
 * /delete/{MovieName}:
 *   delete:
 *     parameters:
 *      - name: MovieName
 *        description: Enter Movie Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *     tags:
 *       - Movie Rental Store
 *     description: Enter the Movie Name for Delete
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delete Movie
 *         examples:
 *           application/json:
 *              {
 *               isError: false,
 *               message: Movie Deleted Successfully
 *              }         
 */
router.delete('/delete/:MovieName', moiveIns.removeMovie);
/**
 * @swagger
 * definitions:
 *   MovieRent:
 *     properties:
 *       MovieName:
 *         type: string
 *       Days:
 *         type: integer
 *       CustomerName:
 *         type: string
 *       useBonus:
 *         type: boolean
 */
/**
 * @swagger
 * /movie/rentmovie:
 *   post:
 *     tags:
 *       - Movie Rental Store
 *     description: Creates a new Rent
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Movie Rent Object
 *         description: Enter Movie Rent Obejct Details
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MovieRent'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.post('/movie/rentmovie', moiveIns.rentMovie);
module.exports = router;