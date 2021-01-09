const Joi = require("joi");
const { trim } = require("lodash");
const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
    airport_name: {
      type: String,
      required: true,
      maxlength: 255,
      uniqiue: true,
      trim: true
    },
    fuel_capacity: {
      type: Number,
      required: true,
      minlength: 0,
      trim: true
    },
    fuel_available: {
      type: Number,
      required: true,
      minlength: 0,
      trim: true
    }
  });

  
const AirportDetail = mongoose.model("airport", airportSchema);

function validateAirportDetail(airportdetail) {
  const schema = {
    airport_name: Joi.string().min(1).max(255).required(),
    fuel_capacity: Joi.number().min(0).required(),
    fuel_available: Joi.number().min(0).required()
  };

  return Joi.validate(airportdetail, schema);
}

exports.AirportDetail = AirportDetail;
exports.validate = validateAirportDetail;