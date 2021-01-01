const express = require('express');
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/auth');

const authRouter = express.Router();

// @route    GET api/getAuthUser
// @desc     get AuthenticatedUserInfo
// @access   Private
authRouter.get('/getAuthUser', authenticateUser, authController.getUserInfo);

// @route    POST api/login
// @desc     get AuthenticatedUserInfo
// @access   Public
authRouter.post(
  '/login',
  authController.validateUserLoginModel,
  authController.login
);

module.exports = authRouter;
