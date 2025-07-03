const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ticketSchema = new Schema({
   title:{
    type:String
   },
   description:{
    type:String
   },
   priority:{
    type:String,
    enum:["Low","Medium","High","Critical"]
   },
   department:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Department"
   },
   status:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Status"
   },
   assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [String],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
    replies: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            message: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    history: [
  {
    action: String, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: String,
    timestamp: { type: Date, default: Date.now }
  }
]

}, { timestamps: true });


module.exports = mongoose.model("Tickets",ticketSchema)