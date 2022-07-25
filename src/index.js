const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");

const route = require("./route/route.js");
const multer= require("multer");
const { AppConfig } = require('aws-sdk');
const app = express();

app.use(bodyParser.json()); // tells the system that you want json to be used
// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(multer().any());
// mongoDb connection
mongoose
  .connect(
    "mongodb+srv://Hamsaram:9113582061h@cluster0.iou3w.mongodb.net/group10Database?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

// Initial route
app.use("/", route);

// port
app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});