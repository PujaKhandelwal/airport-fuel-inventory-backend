const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authentication } = require("../util/authentication");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.airportfuel_jwtPrivateKey);
    req.user = decoded;
    let result = await authentication(req.user._id, req.user.email);

    if (result) next();
    else res.status(401).send("Access Denied");
  } catch (ex) {
    res.status(400).send("Access Denied");
  }
};