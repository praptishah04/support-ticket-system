const mongoose = require("mongoose")
const Schema = mongoose.Schema

const statusSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    color:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    autoCloseInHours:{
        type:Number
    }
},{timestamps:true})


module.exports= mongoose.model("Status",statusSchema)