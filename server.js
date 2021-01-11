const express = require('express');
const user = require("./controller/user");
const auth = require("./controller/auth");
const aircraft = require("./controller/aircraft");
const airport = require("./controller/airport");
const transaction = require("./controller/transaction");
var cors = require('cors')
const app = express();
app.use(cors()) ;
require("./config/db")();
require("./config/configuration")();
require("./config/validation")();
console.log("in server.js");
  app.use(express.json());
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use("/api/aircraft", aircraft);
  app.use("/api/airport", airport);
  app.use("/api/transaction", transaction);
  


const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Listening on port 5000....'));