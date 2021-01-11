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
    console.log(req.body.quantity);
    //validate the request body
    const { error } = validateBody(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    
    //check the airport detail present or not
    let airportdetail = await AirportDetail.findOne({ airport_name: req.body.airport_name.toUpperCase() });
    if (!airportdetail) return res.status(400).json({ error: "No airport found " });

    //check the aircraft present or not
    // let aircraftdetail = await AircraftDetail.findOne({ _id: req.body.aircraft_id });
    // if (!aircraftdetail) return res.status(400).json({ error: "No aircarft found " });

    const overallFuel = airportdetail.fuel_available+parseInt(req.body.quantity);

    //check for fuel availability
    if(airportdetail.fuel_capacity < overallFuel)
    return res.status(400).json({ error: "Overflow!!" });
    await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: overallFuel});

    const transaction = new TransactionDetail(
        {
            transaction_date_time: new Date(),
            transaction_type: 'IN',
            airport_name: req.body.airport_name.toUpperCase(),
            aircraft_no: null,
            // aircraft_id: req.body.aircraft_id,
            quantity: req.body.quantity,
            transaction_id_parent: null
        }
    )
    await transaction.save();
    res.send(transaction);


    function validateBody(req) {
        const schema = {
          airport_name: Joi.string().min(1).max(255).required(),
        //   aircraft_id: Joi.string().min(1).max(255).required(),
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
    let airportdetail = await AirportDetail.findOne({ airport_name: req.body.airport_name.toUpperCase() });
    if (!airportdetail) return res.status(400).json({ error: "No airport found " });

     //check the aircraft present or not
     let aircraftdetail = await AircraftDetail.findOne({ aircraft_no: req.body.aircraft_no.toUpperCase() });
     if (!aircraftdetail) return res.status(400).json({ error: "No aircarft found " });

    
    
    //check for fuel availability
    if(airportdetail.fuel_available < parseInt(req.body.quantity) )
        return res.status(400).json({ error: "Quantity is more than available. Underflow!!" });


   

    const leftFuel = airportdetail.fuel_available-parseInt(req.body.quantity);



 

    await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: leftFuel});



    //calculate transaction_parent_id
    // const transactionhistory = await TransactionDetail.findOne({ aircraft_id: req.body.aircraft_id, transaction_type: "IN"  }).sort({transaction_date_time: -1});
    // let transactionIdParent = null;

    // if(transactionhistory)
    //     {
    //         transactionIdParent = transactionhistory._id;
    //     }


    const transaction = new TransactionDetail(
        {
            transaction_date_time: new Date(),
            transaction_type: 'OUT',
            airport_name: req.body.airport_name.toUpperCase(),
            aircraft_no: req.body.aircraft_no.toUpperCase(),
            quantity: req.body.quantity,
            transaction_id_parent: null
        }
    )
    await transaction.save();
    res.send(transaction);


    function validateBody(req) {
        const schema = {
          airport_name: Joi.string().min(1).max(255).required(),
          aircraft_no: Joi.string().min(1).max(255).required(),
          quantity: Joi.number().min(1).required(),
        };
      
        return Joi.validate(req, schema);
      }





});



//api to delete the entire transactions
router.get('/reset', auth, async (req, res) =>{
    let transactiondetails = await TransactionDetail.deleteMany();
    console.log(transactiondetails)
    res.json({ message: "Successfully Registered!!!!" });


});

//api to reverse a transaction 
router.post('/reverse', auth, async (req, res) =>{
    //check the transaction  
    
    let transactiondetail = await TransactionDetail.findOne({ _id: req.body._id });
    if (!transactiondetail) return res.status(400).json({ error: "No Transaction found " });
    console.log(transactiondetail);
    let type = '';
    const airportdetail = await AirportDetail.findOne({ airport_name: transactiondetail.airport_name });
    console.log(airportdetail);
    let aircraftNumber = '';
    if(transactiondetail.transaction_type === "IN")
    {
        type = "OUT";
        aircraftNumber = null;
        let fuel = airportdetail.fuel_available-transactiondetail.quantity;
        if(fuel >= 0)
            await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: fuel});
        else
            return res.status(400).json({ error: "Cannot be reversed. Underflow" });
            


    }
    else
    {
        type = "IN";
        aircraftNumber= transactiondetail.aircraft_no.toUpperCase();
        let fuel = transactiondetail.quantity+airportdetail.fuel_available;
        console.log(airportdetail.fuel_capacity);
        console.log(airportdetail.fuel_available)
        console.log(fuel);

        if(fuel<=airportdetail.fuel_capacity)
            await AirportDetail.findByIdAndUpdate(airportdetail._id, {fuel_available: fuel});
        else
            return res.status(400).json({ error: "Cannot be reversed. Overflow" });
    }

    await TransactionDetail.findByIdAndUpdate(transactiondetail._id, {transaction_id_parent: "reversed"});
    
    const transaction = new TransactionDetail(
        {
            
            transaction_date_time: new Date(),
            transaction_type: type,
            airport_name: transactiondetail.airport_name.toUpperCase(),
            aircraft_no: aircraftNumber,
            quantity: transactiondetail.quantity,
            transaction_id_parent: req.body._id
        }
    )
    await transaction.save();
    res.json({ message: "Successfully Reversed!!!!" });



})

//display transaction for reverse transaction
router.get("/rev", auth, async (req, res) => {
    let transactiondetails = await TransactionDetail.find({transaction_id_parent: null}).sort({transaction_date_time: -1});
    res.send(transactiondetails);

  });





module.exports = router;