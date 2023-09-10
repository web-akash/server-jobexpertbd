const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/db.js");
const path = require("path");
const nodemon = require("nodemon");
dotenv.config();
const route = require("./routes/index.js");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/pdfs", express.static("pdfs"));

console.log(process.env.HOST_URL);
app.listen(5000 || 5173, () => {
  console.log("Port runnung");
});
dbConnect();

app.use(route);
