const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    select: false,
  },
  userType: {
    type: String,
    required: true,
    maxlength: 50,
  },
  lat: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  lng: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
