const auth = require("../middleware/auth");
const { AircraftDetail, validate } = require("../model/aircraft");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

//API TO ADD AIRCRAFT DETAILS
router.post("/", auth, async (req, res) => {
  console.log('Hello we r in aircraft addition')
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    console.log('Correct');
    console.log(req.body);

    let aircraft = new AircraftDetail(_.pick(req.body, ["aircraft_no", "airline", "source", "destination"]));
    console.log(aircraft);
    await aircraft.save();
    res.json({ message: "Aircraft Added!!" });
  });

// API to list the entire aircraft details
router.get("/", auth, async (req, res) => {
    let aircraftdetails = await AircraftDetail.find().sort({aircraft_no: 1});
    res.send(aircraftdetails);
  });

  module.exports = router;

 