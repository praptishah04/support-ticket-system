const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Departmentschema = new Schema({
    name:{
        type:String
    },
    description:{
        type:String
    },
    email:{
        type:String
    },
   assignedAdmins: 
   [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" }],
   hidden:{
    type:Boolean,
    default:false
   }
    
},{timestamps:true})


module.exports=mongoose.model("Department",Departmentschema)