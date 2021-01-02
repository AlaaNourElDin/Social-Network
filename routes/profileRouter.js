const express = require('express');
const profileController = require('../controllers/profileController');
const authenticateUser = require('../middleware/auth');
const checkObjectId = require('../middleware/checkObjectId');

const profileRouter = express.Router();

// @route    GET api/profile/me
// @desc     get current user profile
// @access   Private
profileRouter.get(
  '/me',
  authenticateUser,
  profileController.getUserProfileInfo
);

// @route    GET api/profile
// @desc     get All profiles
// @access   Public
profileRouter.get('/', profileController.getUserProfiles);

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
profileRouter.post(
  '/',
  authenticateUser,
  profileController.validateProfileModel,
  profileController.createOrUpdateProfile
);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
profileRouter.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  profileController.getProfileByUserId
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
profileRouter.delete(
  '/',
  authenticateUser,
  profileController.deleteProfileByUserId
);

module.exports = profileRouter;
