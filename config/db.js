const mongoose = require("mongoose");

function dbConnect() {
  mongoose
    .connect(
      "mongodb+srv://jobexpart:jobexpart@cluster0.becp0tw.mongodb.net/jpbexpart?retryWrites=true&w=majority"
    )
    .then(() => console.log("Mongo Connected!"))
    .catch((err) => {
      console.log("MongoErro:", err.code);

      
    });
}

module.exports = dbConnect;