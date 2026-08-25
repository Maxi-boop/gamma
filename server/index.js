const express = require("express");
const bodyParser = require("body-parser");
const middlewares = require("./middlewares");
const dotenv = require("dotenv").config();
const app = express();


const mongoose = require("mongoose");
const Staff = require("./models/Staff");

const apiRouter = require("./routers/api");

app.use(express.json());
app.use(bodyParser.json());

const db_string = process.env.MONGODB_URI;
mongoose.connect(db_string);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.use("/api", apiRouter);

app.use(middlewares.errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000.");
});
