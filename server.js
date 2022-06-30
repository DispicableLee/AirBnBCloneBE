const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const airbnb = require("./routes/api/airbnb");
const connectDB = require("./db")

const app = express();
const port = 5002;

app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE');
    next();
  });

app.use(morgan("dev"));
app.use(helmet());
connectDB();
app.use("/api/v1/airbnb", airbnb)

//http://localhost:5000/api/v1/airbnb


app.listen(port, () => console.log(`API Server Listening on port ${port}`));