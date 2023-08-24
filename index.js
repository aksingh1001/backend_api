const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv=require('dotenv')

dotenv.config();

const user = require("./Routes/userroutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const connectDb = async () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};


connectDb()
  .then((res) => console.log("Database connected sucessfully"))
  .catch((err) => console.log("connectin error",err));

// const { registerUser } = require("./Controller/UserController");

// creating the api
app.use("/api/v1", user);


app.listen(8000, () => console.log("server is runing on port no", 8000));