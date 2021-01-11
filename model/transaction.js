const Joi = require("joi");
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    transaction_date_time: {
        type: Date,
        required: true
    },
    transaction_type: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 3,
        trim: true
    },
    airport_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
        trim: true
    },
    aircraft_no: {
        type: String,
        minlength: 1,
        maxlength: 255,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    transaction_id_parent: {
        type: String,
        minlength: 1,
        maxlength: 255,
        trim: true
    }

  });

  
const TransactionDetail = mongoose.model("transaction", transactionSchema);

function validateTransactionDetail(transactiondetail) {
  const schema = {
    transaction_date_time: Joi.date().required(),
    transaction_type: Joi.string().min(2).max(3).required(),
    airport_id: Joi.string().min(1).max(255).required(),
    aircraft_id: Joi.string().min(1).max(255),
    quantity: Joi.number().min(0).required,
    transaction_id_parent: Joi.string().min(1).max(255)

  };

  return Joi.validate(transactiondetail, schema);
}

exports.TransactionDetail = TransactionDetail;
exports.validate = validateTransactionDetail;