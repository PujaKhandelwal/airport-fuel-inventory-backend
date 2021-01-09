const auth = require("../middleware/auth");
const { TransactionDetail, validate } = require("../model/transaction");
const { AirportDetail } = require("../model/airport");
// const { AircraftDetail } = require("../model/aircraft");
const Joi = require("joi");
const _ = require("lodash");
const express = require("express");
const { AircraftDetail } = require("../model/aircraft");
const router = express.Router();


//api to fetch the transactions
router.get("/", auth, async (req, res) => {
    let transactiondetails = await TransactionDetail.find().sort({transaction_date_time: -1});
    res.send(transactiondetails);

  });

//api to add IN transaction 
router.post('/in', auth, async (req, res) =>{
    //validate the request body
    const { error } = validateBody(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    //check the airport detail present or not
    let airportdetail = await AirportDetail.findOne({ _id: req.body.airport_id });
    if (!airportdetail) return res.status(400).json({ error: "No airport found " });

    //check the aircraft present or not
    let aircraftdetail = await AircraftDetail.findOne({ _id: req.body.aircraft_id });
    if (!aircraftdetail) return res.status(400).json({ error: "No aircarft found " });

    //check for fuel availability
    if(airportdetail.fuel_available < req.body.quantity)
        return res.status(400).json({ error: "Quantity is more than available. Underflow!!" });

    const leftFuel = airportdetail.fuel_available-req.body.quantity;

    await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: leftFuel});

    const transaction = new TransactionDetail(
        {
            transaction_date_time: new Date(),
            transaction_type: 'IN',
            airport_id: req.body.airport_id,
            aircraft_id: req.body.aircraft_id,
            quantity: req.body.quantity,
            transaction_id_parent: null
        }
    )
    await transaction.save();
    res.send(transaction);


    function validateBody(req) {
        const schema = {
          airport_id: Joi.string().min(1).max(255).required(),
          aircraft_id: Joi.string().min(1).max(255).required(),
          quantity: Joi.number().min(1).required(),
        };
      
        return Joi.validate(req, schema);
      }



});


//api to add OUT transaction 
router.post('/out', auth, async (req, res) =>{
    //validate the request body
    const { error } = validateBody(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    //check the airport detail present or not
    let airportdetail = await AirportDetail.findOne({ _id: req.body.airport_id });
    if (!airportdetail) return res.status(400).json({ error: "No airport found " });

     //check the aircraft present or not
     let aircraftdetail = await AircraftDetail.findOne({ _id: req.body.aircraft_id });
     if (!aircraftdetail) return res.status(400).json({ error: "No aircarft found " });

   

    const overallFuel = airportdetail.fuel_available+req.body.quantity;

     //check for fuel availability
     if(airportdetail.fuel_capacity < overallFuel)
     return res.status(400).json({ error: "Overflow!!" });

    await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: overallFuel});



    //calculate transaction_parent_id
    const transactionhistory = await TransactionDetail.findOne({ aircraft_id: req.body.aircraft_id, transaction_type: "IN"  }).sort({transaction_date_time: -1});
    let transactionIdParent = null;

    if(transactionhistory)
        {
            transactionIdParent = transactionhistory._id;
        }


    const transaction = new TransactionDetail(
        {
            transaction_date_time: new Date(),
            transaction_type: 'OUT',
            airport_id: req.body.airport_id,
            aircraft_id: req.body.aircraft_id,
            quantity: req.body.quantity,
            transaction_id_parent: transactionIdParent
        }
    )
    await transaction.save();
    res.send(transaction);


    function validateBody(req) {
        const schema = {
          airport_id: Joi.string().min(1).max(255).required(),
          aircraft_id: Joi.string().min(1).max(255).required(),
          quantity: Joi.number().min(1).required(),
        };
      
        return Joi.validate(req, schema);
      }



});




module.exports = router;