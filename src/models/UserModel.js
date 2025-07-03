const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    googleId:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:["user", "agent", "admin"],
        default:"user",
        required:true,
    },
},{timestamps:true});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User",userSchema)

