const normalize = require('normalize-url');
const { check, validationResult } = require('express-validator');
const Profile = require('../models/profileModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const BaseError = require('../exceptions/BasrError');

exports.getUserProfileInfo = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    ['name', 'avatar']
  );

  if (!profile) throw new BaseError('there is no profile for this user', 400);
  res.json(profile);
});

exports.getUserProfiles = catchAsync(async (req, res, next) => {
  const profiles = await Profile.find().populate('user', ['name', 'avatar']);

  res.json(profiles);
});

exports.validateProfileModel = [
  check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
    .not()
    .isEmpty()
];

exports.createOrUpdateProfile = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BaseError('invalid inputs', 400, errors.array());
  }

  // destructure the request
  const {
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
    // spread the rest of the fields we don't need to check
    ...rest
  } = req.body;

  // build a profile
  const profileFields = {
    user: req.user.id,
    website:
      website && website !== '' ? normalize(website, { forceHttps: true }) : '',
    skills: Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => skill.trim()),
    ...rest
  };

  // Build socialFields object
  const socialFields = { youtube, twitter, instagram, linkedin, facebook };

  // normalize social fields to ensure valid url
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(socialFields)) {
    if (value && value.length > 0)
      socialFields[key] = normalize(value, { forceHttps: true });
  }

  // add to profileFields
  profileFields.social = socialFields;

  // Using upsert option (creates new doc if no match is found):
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileFields },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return res.json(profile);
});

exports.getProfileByUserId = catchAsync(
  async ({ params: { userId } }, res, next) => {
    const profile = await Profile.findOne({
      user: userId
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    return res.json(profile);
  }
);

exports.deleteProfileByUserId = catchAsync(async (req, res, next) => {
  // Remove user posts
  //await Post.deleteMany({ user: req.user.id });
  // Remove profile
  await Profile.findOneAndRemove({ user: req.user.id });
  // Remove user
  await User.findOneAndRemove({ _id: req.user.id });

  res.json({ message: 'User deleted' });
});
