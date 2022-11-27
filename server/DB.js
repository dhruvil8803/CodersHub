const mongoose = require("mongoose");
let DATA_BASE = process.env.DATA_BASE;
let connect = ()=>{
  mongoose.connect(DATA_BASE, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection to database successfull");
  }).
  catch((e)=>{
    console.log("Some Error Occured");
  })
}
module.exports = connect;