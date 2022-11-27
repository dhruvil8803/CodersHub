const error = require("./Error");
const User = require("../Models/User");
const jwt = require("jsonwebtoken")
const JWT_KEY = process.env.JWT_KEY;
let userAuth  = error(async (req, res, next) =>{
    const {token} = req.cookies;
     if(!token) return res.status(404).send({
        success : false,
        message: "Login or Register first"
     })
      let response = jwt.verify(token, JWT_KEY);
      req.id = response.id;
      next();
})

let adminAuth = error(async(req, res, next)=>{
   let response = await User.findById(req.id);
   if(response.role !== "admin") return res.status(404).send({
    success: false,
    message : "Users are not allowed to access this page",
   })
   next();
})

module.exports = {userAuth, adminAuth};