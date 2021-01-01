const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const connectDB = require("./db");
const app = require("./app");

connectDB();

const port = process.env.PORT;
const server = app.listen(port, (req, res) => {
  console.log("listening on port " + port);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
