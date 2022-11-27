let User = require("../Models/User");
module.exports = async (x, message)=>{
    x.map(async (e)=>{
        let temp = await User.findById(e.by);
        if(temp){
          temp.notification.push({
           desc: message,
         date: Date.now(),
          })
        }
        await temp.save();
     })
}