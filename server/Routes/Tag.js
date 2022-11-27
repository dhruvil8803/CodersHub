let express = require('express');
let router  =  express.Router();
let {userAuth, adminAuth} = require("../MiddleWares/Auth");
let error = require("../MiddleWares/Error");
let Tag = require("../Models/Tag");
let send = require("../MiddleWares/SendResponse");
let queryGenerator = require("../MiddleWares/QueryGenerator");
let ApiFeature = require("../MiddleWares/ApiFeatures");
let User = require("../Models/User");
let {activity, reputationA} = require("../MiddleWares/Activity");
let validateData = (e, size) => {
  return e.trim().length >= size
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADD Tag~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post("/addTag", userAuth, error(async(req, res, next)=>{
     let {title, desc} = req.body;
     let by = req.id;
     if(title.trim().length > 30 || title.trim().length < 2) return send(false, 404, "Tag should contain 2-30 characters only", res);
    if(!validateData(desc, 25))return send(false, 404, "Tag Descreption must contain atleast 25 characters", res);
     let response = await Tag.create({desc,title, by});

     let user = await User.findById(by);
     activity(user.activity, "Added", "Tag", response._id);
         user.tags.push({key : response._id});
         user.tagNo = user.tagNo + 1;
         await user.save();
         send(true, 200, "Your Tag is live.", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~SHOW ALL TAGS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/showAllTags", error(async(req, res, next)=>{
      let {search, category, sort, pageSize, page} = queryGenerator(req.query);
       let features = new ApiFeature(Tag.find(), search, category, sort, pageSize, page).search().filter().sort().pagination();
       let response = await features.query;
     response.map(async (e)=>{
        let user = await User.findById(e.by);
        if(user){
            user.reached = user.reached + 1;
            await user.save();
        }
        e.editedby.map(async (e)=>{
             user = await User.findById(e.by);
        if(user){
            user.reached = user.reached + 1;
            await user.save();
        }
        })
     })
       res.status(200).send({
           success: true,
           response : response,
           message: "Showing All Tags",
       })
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE STATUS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.put("/updateStatusTag/:id", userAuth, adminAuth, error(async(req, res, next)=>{
     let response = await Tag.findById(req.params.id);
     let userid = "";
     let title = "";
     if(!response) return send(false, 404, "No such Tag exists", res);
      if(response.status === "Update"){
       response.status = "Live";
       response.desc = response.changes;
       response.changes = "";
       response.editedby.push({by : response.editor});
       response.modified = Date.now();
       userid  = response.editor;
       title = "Improved";
     }
     else return send(false, 404, "Cannot Update Status now", res);
      let user = await User.findById(userid);
      if(user){
        let pendings =  user.pending.filter((e)=>(e.desc.toString() !== response._id.toString()));
        user.pending = pendings;
        activity(user.activity, title, "Tag", response._id);
         user.tags.push({key : response._id});
         user.tagNo = user.tagNo + 1;
         user.notification.push({
           desc : `Your suggestion for Tag ${response.title} is accepted and it is visible to all the users` ,
           date: Date.now(),
         })
        await user.save();
      }
     
    await response.save();
   send(true, 200, "Status Updated Successfully", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~REJECT UPDATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/rejectTag/:id", userAuth, adminAuth, error(async(req, res, next)=>{
       let response = await Tag.findById(req.params.id);
       if(!response) return send(false, 404, "Tag not found", res);
       let id = "";
       if(response.status === "Update"){
        response.status = "Live";
        response.changes = "";
        id = response.editor;
        await response.save();
       }
       else return send(false, 404, "Cannot reject this Tag", res);
       let user = await User.findById(id);
       let filter = user.pending.filter((e)=>(e.desc.toString() !== response._id.toString()));
       user.pending = filter;
       user.notification.push({
        date: Date.now(),
        desc: `Your request for Improvement of Tag ${response.title} is rejected`,
       })
       await user.save();
      send(true, 200 , "Rejection Successfull", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~IMPROVE Tag~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post("/updateTag/:id", userAuth, error(async(req, res, next)=>{
    let response = await Tag.findById(req.params.id);
     if(!response) return send(false, 404, "No such Tag exists", res);
     if(!validateData(req.body.desc, 25)) return send(false, 404, "Tag Descreption must contain atleast 25 characters", res);
      if(response.status === "Update") return send(false, 404, "Cannot Update now because Tag is already in update state", res);
     response.editor = req.id;
     response.changes = req.body.desc;
     response.status = "Update";
     let user = await User.findById(req.id);
     user.pending.push({
      title: "Improve",
      articleType: "Tag",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     await response.save();
    send(true, 200, "Your suggestion sent for review", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BOOKMARK ON Tag~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/bookmarkTag/:id", userAuth, error(async(req, res, next)=>{
  let user = await User.findById(req.id);
  let response = await Tag.findById(req.params.id);
  if(!response) return send(false, 404, "No such Tag exists", res);
  let has = user.bookmarks.find((e)=>(e.key.toString() === req.params.id));
   if(has){
    user.bookmarkNo = user.bookmarkNo - 1;
    let filter = user.bookmarks.filter((e)=>(e.key.toString() !== req.params.id));
    user.bookmarks = filter;
    await user.save();
     send(true, 200 , "Bookmark removed", res);
   }
   else{
    user.bookmarkNo = user.bookmarkNo + 1;
    user.bookmarks.push({
      key: req.params.id,
      articleType: "Tag"
    })
     await user.save();
     send(true, 200, "Bookmark added", res);
   }
}))

module.exports = router;