const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter
  .get("/", userController.getAllUsers)
  .post("/", userController.createUser);

module.exports = userRouter;
