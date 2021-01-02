const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BaseError = require('../exceptions/BasrError');
const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (users.length === 0) {
    res.status(204).json({ errors: [{ msg: 'no users found' }] });
  }

  res.status(200).json({ users });
});

exports.validateUserModel = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please provide a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({
    min: 6
  })
];

exports.createUser = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BaseError('invalid inputs', 400, errors.array());
  }
  const { name, email, password } = req.body;

  const avatar = gravatar.url(email, {
    s: '200',
    r: 'pg',
    d: 'mm'
  });

  const user = { name, email, avatar, password };

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(password, salt);

  const newUser = await User.create(user);

  jwt.sign(
    { user: { id: newUser.id } },
    process.env.JWTSECRET,
    {
      expiresIn: 360000
    },
    (err, token) => {
      if (err) throw new BaseError(`error while signing jwt ${err}`);
      res.status(201).json({ token });
    }
  );
});
