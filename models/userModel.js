const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: [true, "name is required"],
  },
  firstname: "string",
  lastname: "string",
  password: "string",
});
const User = mongoose.model("User", userSchema);

module.exports = User;
