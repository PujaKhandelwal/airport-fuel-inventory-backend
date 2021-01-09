const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../model/user");
const express = require("express");
const router = express.Router();

//Fetch User Detail
router.get("/me", auth, async (req, res) => {
    console.log("welcome");
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//Create a new user
router.post("/", async (req, res) => {
    console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ error: "User already registered." });

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.json({ message: "Successfully Registered!!!!" });
});

module.exports = router;