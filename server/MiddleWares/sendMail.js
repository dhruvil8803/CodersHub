const nodemailer = require('nodemailer');
module.exports = async (data)=>{
   const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
       service : "gmail",
       auth : {
       user: process.env.SMPT_EMAIL,
       pass: process.env.SMPT_PASSWORD,
    }
   })
   const mailOptions = {
     from : process.env.SMPT_EMAIL,
     to : data.email,
     subject : data.subject,
     html: data.message
   }
   await transport.sendMail(mailOptions);
}