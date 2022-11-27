let mongoose  = require('mongoose');
let schema = new mongoose.Schema({
  title : {
      type: String,
      required: true,
      trim: true,
  },
  desc: {
      type: String, 
      required : true,
  },
  comments: [
      {
          desc : {
              type: String,
              required: true,
          },
          by:{
            type: mongoose.Schema.ObjectId,  
            required: true,
          },
          date:{
              type: Date,
              required: true,
          }
      }
  ],
  tags: {
      type: Array,
      required: true,
  },
  tagId: {
    type: Array,
    required: true,
},
  views:{
      type: Number,
      default: 0,
  },
  votes:{
      type: Number,
      default: 0,
  },
  voters: [
    {
        by: mongoose.Schema.ObjectId,
    }
  ],
  by: {
      type: mongoose.Schema.ObjectId,
      required: true,
  },
  editedby: [
      {
        by: {
            type: mongoose.Schema.ObjectId,
            required: true,
        },
      }
  ],
  editor: {
      type: mongoose.Schema.ObjectId,
  },
  status:{
      type: String,
       default: "Live",
  },
  changes:{
      type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  modified: {
      type : Date,
      default: Date.now,
  },
  followers: [{
      by: {
          type: mongoose.Schema.ObjectId,
          required: true,
      }
    }
  ],
  answers:{
      type: Number,
      default: 0,
  },
  tick:{
      type: String,
      default: "false",
  }
})

module.exports = mongoose.model("Question", schema);