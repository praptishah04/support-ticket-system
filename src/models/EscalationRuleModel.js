const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Escalationschema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    active:{
        type:Boolean,
        default:true
    },
    logic:{
        type:String,
        enum:["AND","OR"],
        default:"AND"
    },
    conditions:[{
        field:{
            type:String,
            enum:["priority","status","department","timeElapsed"],
            required:true
        },
        value:{
            type:String,
            required:true
        }
    }],
    actions:[{
        type:{
            type:String,
            enum:["escalateTo","changeStatus","changeDepartment","changePriority","addReply"],
            required:true
        },
        value:{
            type:String,
            required:true
        }
    }]
},{timestamps:true})

module.exports = mongoose.model("EscalationRule", Escalationschema)