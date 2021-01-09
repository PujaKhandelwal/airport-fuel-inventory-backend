require("dotenv").config();

//Check private is defined 
module.exports = function () {
  if (!process.env.airportfuel_jwtPrivateKey) {
      console.log(process.env);
    console.log("FATAL ERROR: jwtPrivateKey is not defined.")
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  if (!process.env.mongoDB) {
    console.log(process.env.mongoDB);
    console.log("FATAL ERROR: mongoDB is not defined.")
    throw new Error("FATAL ERROR: mongoDB is not defined.");
  }
};