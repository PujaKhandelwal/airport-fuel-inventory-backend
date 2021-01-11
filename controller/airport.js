const auth = require("../middleware/auth");
const _ = require("lodash");
const { AirportDetail, validate } = require("../model/airport");
const express = require("express");
const router = express.Router();

//API TO ADD airport DETAILS
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // console.log()
    let airportdetail = await AirportDetail.findOne({ airport_name: req.body.airport_name.toUpperCase() });
    if (airportdetail) return res.status(400).json({ error: "Airport Details is already present." });
    console.log(airportdetail);

    if(req.body.fuel_capacity < req.body.fuel_available)
      return res.status(400).json({ error: "Overflow." });
  
    // airportdetail = new AirportDetail(_.pick(req.body, ["airport_name", "fuel_capacity", "fuel_available"]));
    airportdetail = new AirportDetail(
      {
        airport_name: req.body.airport_name.toUpperCase(),
        fuel_capacity: req.body.fuel_capacity,
        fuel_available: req.body.fuel_available
         
      }
  ) 
    
    await airportdetail.save();
    res.json({ message: "Airport Details Added Successfully !!" });
  });

  //API to list the entire airport details
  router.get("/", auth, async (req, res) => {
    let airportdetails = await AirportDetail.find().sort({airport_name: 1});
    res.send(airportdetails);

  });

   // API to update the airport details
router.put("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let airportdetail = await AirportDetail.findOne({ airport_name: req.body.airport_name.toUpperCase() });
    if (!airportdetail) return res.status(400).json({ error: "Airport not present." });

    if(req.body.fuel_capacity < req.body.fuel_available)
    return res.status(400).json({ error: "Overflow." });

    await AirportDetail.findByIdAndUpdate(airportdetail._id, {airport_name: req.body.airport_name.toUpperCase(), 
                fuel_capacity: req.body.fuel_capacity, fuel_available: req.body.fuel_available});

    res.json({ message: "Updated Successfully" });


});

module.exports = router;