require("dotenv").config();
const express = require('express');
const app = express();
const connect = require("./DB.js");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
connect();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret: process.env.API_SECRET
    });
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cookieParser())
app.use("/api/Users", require("./Routes/User"));
app.use("/api/Questions", require("./Routes/Question"));
app.use("/api/Answers", require("./Routes/Answer"));
app.use("/api/Blogs", require("./Routes/Blog"));
app.use("/api/Tags", require("./Routes/Tag"));
app.listen(5000, ()=>{
    console.log("Listening to port 5000");
})
