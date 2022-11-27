let router = require('express').Router();
let error = require("../MiddleWares/Error")
let validate = require('validator');
let send = require("../MiddleWares/SendResponse");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken")
let JWT_KEY = process.env.JWT_KEY;
let JWT_EXPIRES = process.env.JWT_EXPIRES;
let COOKIE_EXPIRES = process.env.COOKIE_EXPIRES;
let User = require("../Models/User");
let {userAuth, adminAuth} = require("../MiddleWares/Auth");
const QueryGenerator = require('../MiddleWares/QueryGenerator');
let ApiFeature = require('../MiddleWares/ApiFeatures');
const crypto = require('crypto')
let sendMail = require("../MiddleWares/sendMail");
const cloudinary = require("cloudinary");
let validateName = (name)=>{
    if(name.length > 15 || name.length < 2) return false;
    return /^[A-z ]+$/.test(name);
}
let validateEmail = (email)=>{
   return validate.isEmail(email);
}
let validatePassword = (pass)=>{
    if(pass.length < 8) return false;
    return true;
    
}
router.post("/registerUser", error(async(req, res, next)=>{
      let {name, email, password, avatar} = req.body;
      if(!validateName(name)) {
        return send(false, 404, "Name must contain 2 to 15 character and only alphabets", res);
      }
      if(!validateEmail(email)){
        return send(false, 404, "Please Enter valid email", res);
      }
      if(!validatePassword(password)) {
        return send(false, 404, "Password must contain 8 characters", res);
      }
      let response = await User.findOne({email: email});
      if(response) return send(false, 404, "User with this ID exists please try login Instead", res);
      password = await bcrypt.hash(password, 10);
      let public_id = process.env.PUBLIC_ID;
      let secure_url = process.env.SECURE_URL;
        if(avatar){
          const mycloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "CodersHub",
            width: 150,
            crop: 'scale',
          })
          public_id = mycloud.public_id;
          secure_url = mycloud.secure_url;
         }

      response = await User.create({name: name, email: email, password: password, avatar:{
          public_id: public_id,
          url: secure_url
        }});
      let token = jwt.sign({id: response._id}, JWT_KEY, {
        expiresIn: JWT_EXPIRES
      }) 
      res.cookie("token", token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
       send(true, 200, "Registeration Successfull", res);
}))

router.post("/loginUser", error(async(req, res, next)=>{
    let {email, password} = req.body;
    if(!validateEmail(email)){
        return send(false, 404, "Please Enter valid email", res);
      }
      if(!validatePassword(password)) {
        return send(false, 404, "Password must contain 8 characters", res);
      }
      let response = await User.findOne({email: email});
      if(!response){
       return send(false, 404, "No Such User Exists", res);
      }
      let ans = await bcrypt.compare(password, response.password);
      if(!ans){
        return send(false, 404, "Invalid Credentials", res);
      } 
     let token = jwt.sign({id: response._id}, JWT_KEY, {
        expiresIn: JWT_EXPIRES
      }) 
      res.cookie("token", token, {
        expires: new Date(Date.now() + COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
       send(true, 200, "Login Successfull", res);
}))

router.get("/showAllUser", error(async(req, res, next)=>{
    let query = req.query;
    let {search, category, sort, pageSize, page} = QueryGenerator(query);
     let feature = new ApiFeature(User.find(), search, category, sort, pageSize, page).search().filter().sort().pagination();
     let response = await feature.query;
     let data = [];
     response.map((e)=>{
      let {name, reputation, date, upVotes, downVotes, avatar, _id} = e;
      data.push({name, reputation, date, upVotes, downVotes, avatar, _id});
     })
    res.status(200).send({
        success: true,
        message: "Showing All Users",
        response: data,
    })
}))
router.get("/showUser/:id", error(async(req, res, next)=>{
      let response = await User.findById(req.params.id);
      if(!response) return send(false, 404, "No such user exists", res);
      res.status(200).send({
        success: true,
        response: response,
        message: "Showing User Details",
      })
}))
router.get("/getUser", userAuth, error(async(req, res, next)=>{
  let response = await User.findById(req.id);
  if(!response) {
    return send(false, 404, "Login or SignUp first", res);
  }
  res.status(200).send({
    success: true,
    response: response,
    message: "Showing User Details",
  })
}))

router.post("/changeName", userAuth, error(async(req, res, next)=>{

    let response = await User.findById(req.id);
    if(!response) return send(false, 404, "User not found", res);
    if(!validateName(req.body.name)) {
      return send(false, 404, "Name must contain 2 to 15 character without and only alphabets", res);
    }
    response.name = req.body.name;
    await response.save();
    send(true, 200, "Name changed Successfully", res);
}))

router.post("/resetPassword", userAuth, error(async(req, res, next)=>{

  let response = await User.findById(req.id);
  if(!response) return send(false, 404, "User not found", res);
  let {oldPassword, newPassword, confirmPassword} = req.body;
  let result = await bcrypt.compare(oldPassword, response.password);
  if(!result) return send(false, 404, "Please enter valid old password", res);
  if(!validatePassword(newPassword)) {
    return send(false, 404, "New Password must contain 8 characters", res);
  }
  if(newPassword !== confirmPassword) return send(false, 404, "Old Password and New Password must be same", res);
  let password = await bcrypt.hash(newPassword, 10);
  response.password = password;
  await response.save();
  send(true, 200, "Password Updated Successfully", res);
}))
router.get("/logoutUser", userAuth, error(async(req, res, next)=>{
   res.cookie('token', "");
   send(true, 200, "Logout Successfull", res);
}))
router.delete("/deleteUser", userAuth, error(async (req, res, next)=>{
  let response = await User.findById(req.id);
  if(!response) return send(false, 404, "User Not found", res);
  response.name = "Anonymous404";
  response.email = process.env.anoEmail;
  let password = process.env.anoPassword;
  password = await bcrypt.hash(password, 10);
  response.password = password;
  response.desc = "";
  await response.save();
  res.cookie('token', "");
  send(true, 200, "Account deletion successfull", res);
}))

router.get("/forgetPassword", error(async (req, res, next)=>{
  let {email} = req.body;
   let response = await User.findOne({email : email})
   if(!response) return send(false, 404, "No Such User Exists", res);
   let token = crypto.randomBytes(20).toString("hex");
   let resettoken = crypto.createHash("sha256").update(token).digest("hex");
   let resettokenexpire = Date.now() + 15 * 60 * 1000;
   let link = `${process.env.DOMAIN_NAME}changePassword/${token}`;
    try {
      let data = {
        email: response.email,
        subject : "Forget Password CodersHub",
        message: `  <div style="display: flex; justify-content: center;">
        <div style="color: white; background-color: #2d2d2d; width: 90vw; align-items: center; padding: 25px; font-family: 'Poppins', sans-serif; max-width: 800px;">
           
           <div style="background-color: black; height: 20vh; width: 90%; margin: 0 auto; padding: 1.5% 0; box-sizing: border-box;">
                <h1 style="color: white; text-align: center;">
                    CodersHub</h1>
                </div>
             <h4 style="width: 90%; margin: 50px; color: white">
                 Hi, ${response.name}
                 <br>
                 A password reset request was recieved for your account with Email id ${response.email}<br>
                 To change the password please click the button below.
             </h4>
             <div style="width: 100%; text-align: center;">
                 <a href=${link} style="color : white; background-color: #328dd2; text-decoration: none; padding: 10px 50px; border-radius: 10px;">Change Password</a>
            </div>
                <h4 style="width: 100%; text-align: center; color: white">If the button doesn't work follow the link <a href=${link}>${link}</a></h4>
                <h3 style="color: red; width: 100%; text-align: center;">Note: Link will expire in 15min after generating it. Please change the password within 15min of request.</h3>
                <h3 style="color: red; width: 100%; text-align: center;">Don't ❌ share this link with anyone.</h3>
            <h4 style="width: 90%; margin: 50px; color: white;">If you haven't requested for password change no need to take any actions.</h4>
            <h1 style="width: 90%; margin: 20px; color: green">Admin, CodersHub</h1>

        </div>
    </div>`
      }
      await sendMail(data);
      response.resetToken = resettoken;
      response.resetExpire = resettokenexpire;
      await response.save();
      send(true, 200, `Forget Password email send to ${response.email}`, res);
    } catch (e) {
      response.resetToken = resettoken;
      response.resetExpire = resettokenexpire;
     await  response.save();
      send(false, 404, e.message, res);
    }
}))

router.post("/changePassword/:id", error( async(req, res, next)=>{
     let resettoken = crypto.createHash("sha256").update(req.params.id).digest("hex");
     let response = await User.findOne({resetToken: resettoken, resetExpire : {
       $gt: Date.now()
     }});
     if(!response) return send(false, 404, "Invalid token or token expired", res);
     let {password, confirmPassword} = req.body;
     if(!validatePassword(password)) return send(false, 404, "Password should have 8 characters", res);
     if(password !== confirmPassword) return send(false, 404, "Password and confirm Password should be same", res);
     let changePass = await bcrypt.hash(password, 10); 
     response.password = changePass;
     response.resetToken = undefined;
     response.resetExpire = undefined;
     await response.save();
     send(true, 200, "Password updated Successfully", res);
}))
module.exports = router;