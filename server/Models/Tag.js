let mongoose  = require('mongoose');
let schema = new mongoose.Schema({
  title : {
      type: String,
      required: true,
      trim: true
  },
  desc: {
      type: String, 
      required : true,
  },
 
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
})

module.exports = mongoose.model("Tag", schema);