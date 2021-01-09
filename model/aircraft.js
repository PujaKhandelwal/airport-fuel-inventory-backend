const Joi = require("joi");
const mongoose = require("mongoose");

const aircraftSchema = new mongoose.Schema({
    aircraft_no: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim: true
    },
    airline: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim:true
    },
    source: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim: true
    }
  });

  
const AircraftDetail = mongoose.model("aircraft", aircraftSchema);

function validateAircraftDetail(aircraftdetail) {
  const schema = {
    aircraft_no: Joi.string().min(1).max(255).required(),
    airline: Joi.string().min(1).max(255).required(),
    source: Joi.string().min(1).max(255).required(),
    destination: Joi.string().min(1).max(255).required()
  };

  return Joi.validate(aircraftdetail, schema);
}

exports.AircraftDetail = AircraftDetail;
exports.validate = validateAircraftDetail;