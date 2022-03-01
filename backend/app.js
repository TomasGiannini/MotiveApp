const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express();

// connect MongoDB
mongoose.connect("mongodb+srv://Tomas:MotiveApp123@cluster0.bcqej.mongodb.net/motiveAppDatabase?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(() => {
    console.log('Connection failed');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
