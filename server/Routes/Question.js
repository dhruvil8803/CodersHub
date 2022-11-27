let express = require('express');
let router  =  express.Router();
let {userAuth, adminAuth} = require("../MiddleWares/Auth");
let error = require("../MiddleWares/Error");
let Question = require("../Models/Question");
let send = require("../MiddleWares/SendResponse");
let queryGenerator = require("../MiddleWares/QueryGenerator");
let ApiFeature = require("../MiddleWares/ApiFeatures");
let User = require("../Models/User");
let sendNotification = require("../MiddleWares/sendNotification");
let {activity, reputationA} = require("../MiddleWares/Activity");
let validateData = (e, size) => {
  return e.trim().length >= size
}
router.post("/addQuestion", userAuth, error(async(req, res, next)=>{
     let {title, desc, tags, tagId} = req.body;
     let by = req.id;
     if(!validateData(title, 15)) return send(false, 404, "Title must contain atleast 15 characters", res);
     if(!validateData(desc, 25))return send(false, 404, "Descreption must contain atleast 25 characters", res);
     let response = await Question.create({title,desc,by,tags, tagId});
     let user = await User.findById(by);
     user.pending.push({
      title: "Add",
      articleType: "Question",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     send(true, 200, "Question sent for review", res);
}))
router.get("/showAllQuestions", error(async(req, res, next)=>{
      let {search, category, sort,tag,  pageSize, page} = queryGenerator(req.query);
       let features = new ApiFeature(Question.find(), search, category, sort, pageSize, page).search().filter().tag(tag).sort().pagination();
       let response = await features.query;
       let data = [];
     response.map((e)=>{
      let {title, desc, tags,  tagId, views, date, votes, by, answers, _id, tick} = e;
      data.push({title, desc, tags,  tagId, views, date, votes, by, answers, _id, tick});
     })
       res.status(200).send({
           success: true,
           response : data,
           message: "Showing All Questions",
       })
}))
router.get("/showQuestion/:id", error(async(req, res,next)=>{
   let response = await Question.findById(req.params.id);
   if(!response) return send(false, 404, "No Such Question Exists", res);

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
     message : "Showing Question",
   })
}))
router.put("/updateStatusQuestion/:id", userAuth, adminAuth, error(async(req, res, next)=>{
     let response = await Question.findById(req.params.id);
     let userid = "";
     let title = "";
     if(!response) return send(false, 404, "No such Question exists", res);
     if(response.status === "Check"){
       response.status = "Live";
       userid  = response.by;
       title = "Asked";
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
        activity(user.activity, title, "Question", response._id);
         user.questions.push({key : response._id});
         user.questionNo = user.questionNo + 1;
         user.notification.push({
           desc : (title === "Improved") ? `Your suggestion for Question ${response.title} is accepted and it is visible to all the users` : 
             `Your Question ${response.title} is Accepted and it is visible to all the users`,
           date: Date.now(),
         })
        await user.save();
      }
     
    await response.save();
    await sendNotification(response.followers, `The Question ${response.title} which you are following has some improvments`);
    send(true, 200, "Status Updated Successfully", res);
}))

router.get("/rejectQuestion/:id", userAuth, adminAuth, error(async(req, res, next)=>{
       let response = await Question.findById(req.params.id);
       if(!response) return send(false, 404, "Question not found", res);
       let id = "";
       let type = "";
       if(response.status === "Check"){
        await Question.findByIdAndDelete(response._id);
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
       else return send(false, 404, "Cannot reject this Question", res);
       let user = await User.findById(id);
       let filter = user.pending.filter((e)=>(e.desc.toString() !== response._id.toString()));
       user.pending = filter;
       user.notification.push({
        date: Date.now(),
        desc: (type === "Check") ? `Your request for adding Question ${response.title} is rejected` : 
         `Your request for Improvement of Question ${response.title} is rejected`
       })
       await user.save();
      send(true, 200 , "Rejection Successfull", res);
}))



router.post("/updateQuestion/:id", userAuth, error(async(req, res, next)=>{
    let response = await Question.findById(req.params.id);
     if(!response) return send(false, 404, "No such Question exists", res);
     if(!validateData(req.body.desc, 25)) return send(false, 404, "Descreption must contain atleast 25 characters", res);
      if(response.status === "Update" || response.status === "Check") return send(false, 404, "Cannot Update now because question is already in update state", res);
     response.editor = req.id;
     response.changes = req.body.desc;
     response.status = "Update";
     let user = await User.findById(req.id);
     user.pending.push({
      title: "Improve",
      articleType: "Question",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     await response.save();
    send(true, 200, "Your suggestion sent for review", res);
}))

router.get("/followQuestion/:id", userAuth, error(async(req, res, next)=>{
  let response = await Question.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No such Question exists", res);
  if(response.status === "Check") return send(false, 404, "Cannot follow this question right now", res);
  let has = response.followers.find((e)=>(e.by.toString() === req.id));
  if(has){
    let filter = response.followers.filter((e)=>(e.by.toString() !== req.id));
    response.followers = filter;
    filter = user.following.filter((e)=>(e.key.toString() !== req.params.id));
    user.following = filter;
    user.followingNo = user.followingNo - 1;
    await response.save();
    await user.save();
    send(true, 200, "Unfollowed-You will not get any notifications on changes for this Question", res);
  }
  else{
    response.followers.push({by: req.id});
    user.following.push({
        articleType: "Question",
        key: req.params.id
      });
      user.followingNo = user.followingNo + 1;
    await response.save();
    await user.save();
    send(true, 200, "Followed-You will be notified on changes for this Question", res);
  }
}))

router.post("/commentQuestion/:id", userAuth, error(async(req, res, next)=>{
  let response = await Question.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Question exists", res);
  if(!validateData(req.body.desc, 10)) return send(false, 404, "Comment must contain 10 characters", res);
  if(response.status === "Check") return send(false, 404, "Cannot comment on this now", res);
   response.comments.push({
    desc : req.body.desc,
  by: req.id,
  date: Date.now(),
   });
   activity(user.activity, "Commented", "Question", response._id);
   await user.save();
   await response.save();
   await sendNotification(response.followers, `The question ${response.title} which you are following has new comment`);
   send(true, 200, "Comment added successfully", res);
}));


router.get("/voteQuestion/:id", userAuth, error(async(req, res, next)=>{
  let response = await Question.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Question exists", res);
   if(response.status === "Check") return send(false, 404, "Cannot vote on this now.", res);
  if(req.id === response.by.toString()) return send(false, 404, "You cannot vote your own Question", res);
  if(user.reputation < 25) return send(false, 404, "Your Reputation must be atleast 25 for voting", res);
  let has = response.voters.find((e)=>(e.by.toString() === req.id));
   if(has) return send(false, 404, "Cannot vote you have voted once", res);
   response.voters.push({
     by : req.id
   })
   if(req.body.vote === -1){
     user.downVotes = user.downVotes + 1;
     user.totalVotes = user.totalVotes + 1;
     user.reputation = user.reputation - 1;
     reputationA(user.reputationA, -1, "Question", response._id);
   }
   else {
    user.upVotes = user.upVotes + 1;
    user.totalVotes = user.totalVotes + 1;
   }
   response.votes = response.votes + req.body.vote;
   let temp = await User.findById(response.by);
   if(req.body.vote === -1){
     temp.reputation = temp.reputation - 2;
     reputationA(temp.reputationA, -2, "Question", response._id);
   }
   else {
     temp.reputation = temp.reputation + 10;
     reputationA(temp.reputationA, 10, "Question", response._id);
  }
  activity(user.activity, "Voted", "Question", response._id);
   await temp.save();
   await user.save();
   await response.save();
   send(true, 200, "Voted on this Question", res);
}));


router.get("/bookmarkQuestion/:id", userAuth, error(async(req, res, next)=>{
  let user = await User.findById(req.id);
  let response = await Question.findById(req.params.id);
  if(!response) return send(false, 404, "No such question exists", res);
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
      articleType: "Question"
    })
     await user.save();
     send(true, 200, "Bookmark added", res);
   }
}))

module.exports = router;