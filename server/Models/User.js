const mongoose = require("mongoose");
let schema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim: true,
    },
    desc:{
        type: String,
        trim: true,
    },
    email:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar:{
            public_id:{
                type: String,
                required: true,
            },
            url :{
                type: String,
                required: true,
            }
    },
    questions: [{
       key: {
        type: mongoose.Schema.ObjectId,
       }
    }
    ],
    tags: [{
        key: {
         type: mongoose.Schema.ObjectId,
        }
     }
     ],
    answers: [{
       key: {
        type: mongoose.Schema.ObjectId,
       }
    }
    ],
    blogs: [{
       key: {
        type: mongoose.Schema.ObjectId,
       }
    }
    ],
    friends: [{
        user: {
            type: mongoose.Schema.ObjectId,
            required: true,
        }
    }],
    following:[{
        articleType: {
          type: String,
          required: true,
        },
        key:{
            type: mongoose.Schema.ObjectId,
            required: true,
        }
    }],
    bookmarks:[{
        articleType: {
          type: String,
          required: true,
        },
        key:{
            type: mongoose.Schema.ObjectId,
            required: true,
        }
    }],
    friendsNo: {
        type: Number,
        default: 0,
    },
    followingNo: {
        type: Number,
        default: 0,
    },
    tagNo: {
        type: Number,
        default: 0,
    },
    questionNo: {
        type: Number,
        default: 0,
    },
    answerNo: {
        type: Number,
        default: 0,
    },
    blogNo: {
        type: Number,
        default: 0,
    },
    bookmarkNo: {
        type: Number,
        default: 0,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    reputationA:[
       {
        change: {
            type: Number,
        },
        articleType: {
            type: String,
            required: true,
        },
        desc:{
            type: mongoose.Schema.ObjectId,
        },
        date: {
            type: Date,
            required: true,
        }
       }
    ],
    activity: [
        {
            title: {
                type: String,
                required: true,
            },
            articleType: {
                type: String,
                required: true,
            },
            desc: {
                type: mongoose.Schema.ObjectId,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            }
        }
    ],
    pending:[
        {
            title: {
                type: String,
                required: true,
            },
            articleType: {
                type: String,
                required: true,
            },
            desc: {
                type: mongoose.Schema.ObjectId,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            }
        }
    ],
    resetToken: String,
    resetExpire: String,
    date: {
        type: Date,
        default: Date.now,
    },
    reached:{
        type: Number,
        default: 0,
    }
    ,
    upVotes:{
        type: Number,
        default: 0,
    },
    downVotes: {
        type: Number,
        default: 0,
    }, 
    totalVotes: {
        type: Number,
        default: 0,
    },
    role:{
        type: String,
        default: "user",
    },
    notification: [
        {
        desc: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
           required: true,
        }
    }
    ]
})

module.exports = mongoose.model("User", schema);