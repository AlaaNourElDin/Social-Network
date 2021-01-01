const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

// @route    GET api/users
// @desc     Get all users
// @access   Public
userRouter.get('/', userController.getAllUsers);

// @route    POST api/users
// @desc     Register user
// @access   Public
userRouter.post(
  '/',
  userController.validateUserModel,
  userController.createUser
);

module.exports = userRouter;
