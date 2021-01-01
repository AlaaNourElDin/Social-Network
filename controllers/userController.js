const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  users
    ? res.status(204).json({ errors: [{ msg: "no users found" }] })
    : res.status(200).json({ users });
});

exports.createUser = catchAsync(async (req, res, next) => {
  user = req.body;
  const newUser = await User.create(user);

  res.status(201).json({ user: newUser });
});
