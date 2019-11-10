'use strict';
const express = require("express");
const router = express.Router();
const userController = require('./../controller/user-controller');

/**
 * @swagger
 * /get/{Username}:
 *   get:
 *     parameters:
 *      - name: Username
 *        description: Enter Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *     tags:
 *       - CURD operations for Users
 *     description: Enter the user name to fetch the user details
 *     produces:
 *       - application/json  
 *     responses:
 *       200:
 *         description: User Details
 *         examples:
 *           application/json:
 *              [{
 *              "Id": "1",
 *               "Name": "Ravi",
 *               "Type": "Movie",
 *               "Favorite": "Action"
 *              }]         
 */
router.get('/get/:Username', userController.getUserDetails);

/**
 * @swagger
 * /add/{Username}/{Type}/{Favorite}:
 *   post:
 *     parameters:
 *      - name: Username
 *        description: Enter Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *      - name: Type
 *        description: Select Type
 *        enum: ["Movie", "Food"]
 *        in: path
 *        required: true   
 *      - name: Favorite
 *        description: Enter Favorite Ex:"Action", "Drama", "Chinese", "Indian"
 *        schema:
 *          type: string  
 *        in: path
 *        required: true      
 *     tags:
 *       - CURD operations for Users
 *     description: Enter the user details
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Add User
 *         examples:
 *           application/json:
 *              {
 *              "Id": "1",
 *               "Name": "Ravi",
 *               "Type": "Movie",
 *               "Favorite": "Action"
 *              }         
 */
router.post('/add/:Username/:Type/:Favorite', userController.addUserDetails);

/**
 * @swagger
 * /update/{Username}/{Type}/{Favorite}:
 *   put:
 *     parameters:
 *      - name: Username
 *        description: Enter Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *      - name: Type
 *        description: Select Type
 *        enum: ["Movie", "Food"]
 *        in: path
 *        required: true   
 *      - name: Favorite
 *        description: Enter Favorite Ex:"Action", "Drama", "Chinese", "Indian"
 *        schema:
 *          type: string  
 *        in: path
 *        required: true      
 *     tags:
 *       - CURD operations for Users
 *     description: Enter the user details
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: update User
 *         examples:
 *           application/json:
 *              {
 *              "Id": "1",
 *               "Name": "Ravi",
 *               "Type": "Movie",
 *               "Favorite": "Action"
 *              }         
 */
router.put('/update/:Username/:Type/:Favorite', userController.updateUserDetails);

/**
 * @swagger
 * /delete/{Username}/{Type}/{Favorite}:
 *   delete:
 *     parameters:
 *      - name: Username
 *        description: Enter Name
 *        schema:
 *          type: string
 *        in: path
 *        required: true   
 *      - name: Type
 *        description: Select Type
 *        enum: ["Movie", "Food"]
 *        in: path
 *        required: true   
 *      - name: Favorite
 *        description: Enter Favorite Ex:"Action", "Drama", "Chinese", "Indian"
 *        schema:
 *          type: string  
 *        in: path
 *        required: true      
 *     tags:
 *       - CURD operations for Users
 *     description: Enter the user details
 *     produces:
 *       - application/json  
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: delete User
 *         examples:
 *           application/json:
 *              {
 *              "Id": "1",
 *               "Name": "Ravi",
 *               "Type": "Movie",
 *               "Favorite": "Action"
 *              }         
 */
router.delete('/delete/:Username/:Type/:Favorite', userController.deleteUserDetails);
module.exports = router;