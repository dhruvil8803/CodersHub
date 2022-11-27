let express = require('express');
let router  =  express.Router();
let {userAuth, adminAuth} = require("../MiddleWares/Auth");
let error = require("../MiddleWares/Error");
let Question = require("../Models/Question");
let Answer = require("../Models/Answer");
let send = require("../MiddleWares/SendResponse");
let queryGenerator = require("../MiddleWares/QueryGenerator");
let ApiFeature = require("../MiddleWares/ApiFeatures");
let User = require("../Models/User");
let sendNotification = require("../MiddleWares/sendNotification");
let {activity, reputationA} = require("../MiddleWares/Activity");

let validateData = (e, size) => {
  return e.trim().length >= size
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADD ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post("/addAnswer/:id", userAuth, error(async(req, res, next)=>{
     let {desc} = req.body;
     let by = req.id;
     let question = req.params.id;
     let que  = await Question.findById(question);
     if(!que) return send(false, 404, "Question not found", res); 
     if(que.status === "Check") return send(false, 404, "Cannot Answer this question now", res);
    if(!validateData(desc, 25))return send(false, 404, "Answer must contain atleast 25 characters", res);
     let response = await Answer.create({desc,by, question});
     let user = await User.findById(by);
     que.answers = que.answers + 1;
   
     activity(user.activity, "Answered", "Answer", response._id);
         user.answers.push({key : response._id});
         user.answerNo = user.answerNo + 1;
         user.notification.push({
           desc : `Your Answer for Question ${que.title} is Live and it is visible to all the users`,
           date: Date.now(),
         })
         await user.save();
         await que.save();
         send(true, 200, "Your answer for this question is Live", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~SHOW ALL ANSWERS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/showAllAnswers", error(async(req, res, next)=>{
      let {search, category, sort, pageSize, page} = queryGenerator(req.query);
       let features = new ApiFeature(Answer.find(), search, category, sort, pageSize, page).filter().sort().pagination();
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
           message: "Showing All Answers For Question",
       })
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~GET QUESTION ID~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/getQuestionId/:id", error(async(req, res,next)=>{
   let response = await Answer.findById(req.params.id);
   if(!response) return send(false, 404, "No Such Answer Exists", res);
   res.status(200).send({
     success : true,
     response : response.question,
     message : "Question Id",
   })
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~UPDATE STATUS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.put("/updateStatusAnswer/:id", userAuth, adminAuth, error(async(req, res, next)=>{
     let response = await Answer.findById(req.params.id);
     let userid = "";
     let title = "";
     if(!response) return send(false, 404, "No such Answer exists", res);
     let question = await Question.findById(response.question);
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
        activity(user.activity, title, "Answer", response._id);
         user.answers.push({key : response._id});
         user.answerNo = user.answerNo + 1;
         user.notification.push({
           desc : `Your suggestion for Answer of Question ${question.title} is accepted and it is visible to all the users` ,
           date: Date.now(),
         })
        await user.save();
      }
     
    await response.save();
    await sendNotification(response.followers, `The Answer of Question ${question.title} which you are following has some improvments`);
    send(true, 200, "Status Updated Successfully", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~REJECT UPDATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/rejectAnswer/:id", userAuth, adminAuth, error(async(req, res, next)=>{
       let response = await Answer.findById(req.params.id);
       if(!response) return send(false, 404, "Answer not found", res);
       let question = await Question.findById(response.question);
       let id = "";
       if(response.status === "Update"){
        response.status = "Live";
        response.changes = "";
        id = response.editor;
        await response.save();
       }
       else return send(false, 404, "Cannot reject this Answer", res);
       let user = await User.findById(id);
       let filter = user.pending.filter((e)=>(e.desc.toString() !== response._id.toString()));
       user.pending = filter;
       user.notification.push({
        date: Date.now(),
        desc: `Your request for Improvement of Answer for Question ${question.title} is rejected`,
       })
       await user.save();
      send(true, 200 , "Rejection Successfull", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~IMPROVE ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post("/updateAnswer/:id", userAuth, error(async(req, res, next)=>{
    let response = await Answer.findById(req.params.id);
     if(!response) return send(false, 404, "No such Answer exists", res);
     if(!validateData(req.body.desc, 25)) return send(false, 404, "Answer must contain atleast 25 characters", res);
      if(response.status === "Update") return send(false, 404, "Cannot Update now because answer is already in update state", res);
     response.editor = req.id;
     response.changes = req.body.desc;
     response.status = "Update";
     let user = await User.findById(req.id);
     user.pending.push({
      title: "Improve",
      articleType: "Answer",
    desc: response._id,
    date: Date.now(),
     })
     await user.save();
     await response.save();
    send(true, 200, "Your suggestion sent for review", res);
}))

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~FOLLOW ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/followAnswer/:id", userAuth, error(async(req, res, next)=>{
  let response = await Answer.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No such Question exists", res);
  let has = response.followers.find((e)=>(e.by.toString() === req.id));
  if(has){
    let filter = response.followers.filter((e)=>(e.by.toString() !== req.id));
    response.followers = filter;
    filter = user.following.filter((e)=>(e.key.toString() !== req.params.id));
    user.following = filter;
    user.followingNo = user.followingNo - 1;
    await response.save();
    await user.save();
    send(true, 200, "Unfollowed-You will not get any notifications on changes for this Answer", res);
  }
  else{
    response.followers.push({by: req.id});
    user.following.push({
        articleType: "Answer",
        key: req.params.id
      });
      user.followingNo = user.followingNo + 1;
    await response.save();
    await user.save();
    send(true, 200, "Followed-You will be notified on changes for this Answer", res);
  }
}))
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~COMMENT ON ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post("/commentAnswer/:id", userAuth, error(async(req, res, next)=>{
  let response = await Answer.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Question exists", res);
  if(!validateData(req.body.desc, 10)) return send(false, 404, "Comment must contain 10 characters", res);
  let question = await Question.findById(response.question);
   response.comments.push({
    desc : req.body.desc,
  by: req.id,
  date: Date.now(),
   });
   activity(user.activity, "Commented", "Answer", response._id);
   await user.save();
   await response.save();
   await sendNotification(response.followers, `The answer of question ${question.title} which you are following has new comment`);
   send(true, 200, "Comment added successfully", res);
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~VOTE ON ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/voteAnswer/:id", userAuth, error(async(req, res, next)=>{
  let response = await Answer.findById(req.params.id);
  let user = await User.findById(req.id);
  if(!response) return send(false, 404, "No Such Answer exists", res);
  if(req.id === response.by.toString()) return send(false, 404, "You cannot vote your own Answer", res);
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
     reputationA(user.reputationA, -1, "Answer", response._id);
   }
   else {
    user.upVotes = user.upVotes + 1;
    user.totalVotes = user.totalVotes + 1;
   }
   response.votes = response.votes + req.body.vote;
   let temp = await User.findById(response.by);
   if(req.body.vote === -1){
     temp.reputation = temp.reputation - 2;
     reputationA(temp.reputationA, -2, "Answer", response._id);
   }
   else {
     temp.reputation = temp.reputation + 10;
     reputationA(temp.reputationA, 10, "Answer", response._id);
  }
  activity(user.activity, "Voted", "Answer", response._id);
   await temp.save();
   await user.save();
   await response.save();
   send(true, 200, "Voted on this Answer", res);
}));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BOOKMARK ON ANSWER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/bookmarkAnswer/:id", userAuth, error(async(req, res, next)=>{
  let user = await User.findById(req.id);
  let response = await Answer.findById(req.params.id);
  if(!response) return send(false, 404, "No such answer exists", res);
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
      articleType: "Answer"
    })
     await user.save();
     send(true, 200, "Bookmark added", res);
   }
}))
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Tick Answer~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get("/tickAnswer/:id", error(async(req, res,next)=>{
    let response = await Answer.findById(req.params.id);
    if(!response) send(false, 404, "Answer no found", res);
    response.tick = "true";
    let question = await Question.findById(response.question);
    question.tick = "true";
    await response.save();
    await question.save();
    send(true, 200, "Answer is marked correct", res);
}))

module.exports = router;