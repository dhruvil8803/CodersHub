let express = require('express');
let router  =  express.Router();
let {userAuth, adminAuth} = require("../MiddleWares/Auth");
let error = require("../MiddleWares/Error");
let send = require("../MiddleWares/SendResponse");
let queryGenerator = require("../MiddleWares/QueryGenerator");
let ApiFeature = require("../MiddleWares/ApiFeatures");
let User = require("../Models/User");
let sendNotification = require("../MiddleWares/sendNotification");
let {activity, reputationA} = require("../MiddleWares/Activity");
let Blog = require("../Models/Blog");
let validateData = (e, size) => {
  return e.trim().length >= size
}

// ###################################### Add Blogs ################################################


router.post("/addBlog", userAuth, error(async(req, res, next)=>{
     let {title, desc, tags, tagId} = req.body;
     let by = req.id;
     if(!validateData(title, 5)) return send(false, 404, "Title must contain atleast 5 characters", res);
     if(!validateData(desc, 75))return send(false, 404, "Descreption must contain atleast 75 characters", res);
     let response = await Blog.create({title,desc,by,tags, tagId});
     let user = await User.findById(by);
     user.pending.push({
      title: "Add",
      articleType: "Blog",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     send(true, 200, "Blog sent for review", res);
}))


// ####################################### Show All Blogs #####################################


router.get("/showAllBlogs", error(async(req, res, next)=>{
      let {search, category, sort,tag,  pageSize, page} = queryGenerator(req.query);
       let features = new ApiFeature(Blog.find(), search, category, sort, pageSize, page).search().filter().tag(tag).sort().pagination();
       let response = await features.query;
       let data = [];
     response.map((e)=>{
      let {title, desc, tags,  tagId, views, date, votes, by, _id} = e;
      data.push({title, desc, tags,  tagId, views, date, votes, by,  _id});
     })
       res.status(200).send({
           success: true,
           response : data,
           message: "Showing All Blogs",
       })
}))


// ######################################## Show Blog ######################################


router.get("/showBlog/:id", error(async(req, res,next)=>{
   let response = await Blog.findById(req.params.id);
   if(!response) return send(false, 404, "No Such Blog Exists", res);

   response.views = response.views + 1;
   let ans = await User.findById(response.by);
   if(ans){
     ans.reached = ans.reached + 1;
     await ans.save();

   }
   response.editedby.map(async (e)=>{
    let z = await User.findById(e);
    if(z){
      z.reached = z.reached + 1;
      await z.save();
    }
   })
   await response.save();
   res.status(200).send({
     success : true,
     response : response,
     message : "Showing Blog",
   })
}))


// ###################################### Update Blog Status #######################################


router.put("/updateStatusBlog/:id", userAuth, adminAuth, error(async(req, res, next)=>{
     let response = await Blog.findById(req.params.id);
     let userid = "";
     let title = "";
     if(!response) return send(false, 404, "No such Blog exists", res);
     if(response.status === "Check"){
       response.status = "Live";
       userid  = response.by;
       title = "Blog Entry";
     }
     else if(response.status === "Update"){
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
        activity(user.activity, title, "Blog", response._id);
         user.blogs.push({key : response._id});
         user.blogNo = user.blogNo + 1;
         user.notification.push({
           desc : (title === "Improved") ? `Your suggestion for Blog ${response.title} is accepted and it is visible to all the users` : 
             `Your Blog ${response.title} is Accepted and it is visible to all the users`,
           date: Date.now(),
         })
        await user.save();
      }
     
    await response.save();
    await sendNotification(response.followers, `The Blog ${response.title} which you are following has some improvments`);
    send(true, 200, "Status Updated Successfully", res);
}))


// ########################################## Reject Blog ###########################################


router.get("/rejectBlog/:id", userAuth, adminAuth, error(async(req, res, next)=>{
       let response = await Blog.findById(req.params.id);
       if(!response) return send(false, 404, "Blog not found", res);
       let id = "";
       let type = "";
       if(response.status === "Check"){
        await Blog.findByIdAndDelete(response._id);
        id = response.by;
        type = "Check";
       }
       else if(response.status === "Update"){
        response.status = "Live";
        response.changes = "";
        id = response.editor;
        type = "Update";
        await response.save();
       }
       else return send(false, 404, "Cannot reject this Blog", res);
       let user = await User.findById(id);
       let filter = user.pending.filter((e)=>(e.desc.toString() !== response._id.toString()));
       user.pending = filter;
       user.notification.push({
        date: Date.now(),
        desc: (type === "Check") ? `Your request for adding Blog ${response.title} is rejected` : 
         `Your request for Improvement of Blog ${response.title} is rejected`
       })
       await user.save();
      send(true, 200 , "Rejection Successfull", res);
}))


// ####################################### Update Blog ################################################


router.post("/updateBlog/:id", userAuth, error(async(req, res, next)=>{
    let response = await Blog.findById(req.params.id);
     if(!response) return send(false, 404, "No such Blog exists", res);
     if(!validateData(req.body.desc, 75)) return send(false, 404, "Descreption must contain atleast 75 characters", res);
      if(response.status === "Update" || response.status === "Check") return send(false, 404, "Cannot Update now because blog is already in update state", res);
     response.editor = req.id;
     response.changes = req.body.desc;
     response.status = "Update";
     let user = await User.findById(req.id);
     user.pending.push({
      title: "Improve",
      articleType: "Blog",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     await response.save();
    send(true, 200, "Your suggestion sent for review", res);
}))


// ####################################### Follow  Blog ##############################################


router.get("/followBlog/:id", userAuth, error(async(req, res, next)=>{
  let response = await Blog.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No such Blog exists", res);
  if(response.status === "Check") return send(false, 404, "Cannot follow this blog right now", res);
  let has = response.followers.find((e)=>(e.by.toString() === req.id));
  if(has){
    let filter = response.followers.filter((e)=>(e.by.toString() !== req.id));
    response.followers = filter;
    filter = user.following.filter((e)=>(e.key.toString() !== req.params.id));
    user.following = filter;
    user.followingNo = user.followingNo - 1;
    await response.save();
    await user.save();
    send(true, 200, "Unfollowed-You will not get any notifications on changes for this Blog", res);
  }
  else{
    response.followers.push({by: req.id});
    user.following.push({
        articleType: "Blog",
        key: req.params.id
      });
      user.followingNo = user.followingNo + 1;
    await response.save();
    await user.save();
    send(true, 200, "Followed-You will be notified on changes for this Blog", res);
  }
}))


// ######################################### Comment on Blog ##################################### 


router.post("/commentBlog/:id", userAuth, error(async(req, res, next)=>{
  let response = await Blog.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Blog exists", res);
  if(!validateData(req.body.desc, 10)) return send(false, 404, "Comment must contain 10 characters", res);
  if(response.status === "Check") return send(false, 404, "Cannot comment on this Blog now", res);
   response.comments.push({
    desc : req.body.desc,
  by: req.id,
  date: Date.now(),
   });
   activity(user.activity, "Commented", "Blog", response._id);
   await user.save();
   await response.save();
   await sendNotification(response.followers, `The Blog ${response.title} which you are following has new comment`);
   send(true, 200, "Comment added successfully", res);
}));


// ########################################## Vote Blog ############################################


router.get("/voteBlog/:id", userAuth, error(async(req, res, next)=>{
  let response = await Blog.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Blog exists", res);
   if(response.status === "Check") return send(false, 404, "Cannot vote on this now.", res);
  if(req.id === response.by.toString()) return send(false, 404, "You cannot vote your own Blog", res);
  if(user.reputation < 25) return send(false, 404, "Your Reputation must be atleast 25 for voting", res);
  let has = response.voters.find((e)=>(e.by.toString() === req.id));
   if(has) return send(false, 404, "Cannot vote, you have voted once", res);
   response.voters.push({
     by : req.id
   })
   if(req.body.vote === -1){
     user.downVotes = user.downVotes + 1;
     user.totalVotes = user.totalVotes + 1;
     user.reputation = user.reputation - 1;
     reputationA(user.reputationA, -1, "Blog", response._id);
   }
   else {
    user.upVotes = user.upVotes + 1;
    user.totalVotes = user.totalVotes + 1;
   }
   response.votes = response.votes + req.body.vote;
   let temp = await User.findById(response.by);
   if(req.body.vote === -1){
     temp.reputation = temp.reputation - 2;
     reputationA(temp.reputationA, -2, "Blog", response._id);
   }
   else {
     temp.reputation = temp.reputation + 10;
     reputationA(temp.reputationA, 10, "Blog", response._id);
  }
  activity(user.activity, "Voted", "Blog", response._id);
   await temp.save();
   await user.save();
   await response.save();
   send(true, 200, "Voted on this Blog", res);
}));


// ############################### BookMark Blog #####################################


router.get("/bookmarkBlog/:id", userAuth, error(async(req, res, next)=>{
  let user = await User.findById(req.id);
  let response = await Blog.findById(req.params.id);
  if(!response) return send(false, 404, "No such blog exists", res);
  if(response.status === "Check") return send(false, 404, "Cannot bookmark it now", res);
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
      articleType: "Blog"
    })
     await user.save();
     send(true, 200, "Bookmark added", res);
   }
}))


module.exports = router;