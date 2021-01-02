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

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
profileRouter.put(
  '/experience',

  authenticateUser,
  profileController.validateExperinceModel,
  profileController.addProfileExperience
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

profileRouter.delete(
  '/experience/:exp_id',
  authenticateUser,
  profileController.deleteProfileExperience
);

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
profileRouter.put(
  '/education',

  authenticateUser,
  profileController.validateEducationModel,
  profileController.addProfileEducation
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

profileRouter.delete(
  '/education/:edu_id',
  authenticateUser,
  profileController.deleteProfileEducation
);

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
profileRouter.get(
  '/github/:username',
  profileController.getUserReposFromGithub
);

module.exports = profileRouter;
