const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT;
app.listen(port, (req, res) => {
  console.log("listening on port " + port);
});
