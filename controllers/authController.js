const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const BaseError = require('../exceptions/BasrError');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getUserInfo = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

exports.validateUserLoginModel = [
  check('email', 'Please provide a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({
    min: 6
  })
];

exports.login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BaseError('invalid inputs', 400, errors.array());
  }
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (Object.keys(user).length === 0) {
    throw new BaseError('email or password is not correct', 401);
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new BaseError('email or password is not correct', 401);
  }

  jwt.sign(
    { user: { id: user.id } },
    process.env.JWTSECRET,
    {
      expiresIn: 360000
    },
    (err, token) => {
      if (err) throw new BaseError(`error while signing jwt ${err}`);
      res.status(200).json({ token });
    }
  );
});
