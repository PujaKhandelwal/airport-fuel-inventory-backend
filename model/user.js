require("dotenv").config();
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
      
    }
  });
  
  userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      { _id: this._id, email: this.email},
      process.env.airportfuel_jwtPrivateKey
    );
    return token;
  };
  
  const User = mongoose.model("User", userSchema);
  
  function validateUser(user) {
    const schema = {
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }
  
  exports.User = User;
  exports.validate = validateUser;