const mongoose = require("mongoose");

require("dotenv").config();
module.exports = function () {
    mongoose
    .connect(process.env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.info(`Connected to monogDB...`));
};