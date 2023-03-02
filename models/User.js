const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  domain: {
    type: String,
  },
  level: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // image: {
  //   data: Buffer,
  //   contentType: Image,
  // },
});

const Users = mongoose.model("users", UserSchema);
module.exports = Users;
