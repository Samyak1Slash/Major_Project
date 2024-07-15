const { string } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true     //***IMP***Hum sirf email define krr rhe hai baaki passport local mongoose khud se username and password with hashing and salting add krta hai
    },

});

userSchema.plugin(passportLocalMongoose);//Aur joh upar wala comment joh likha hai yeh wla code woh sab kaam krta hai like hashing and salting

module.exports = mongoose.model('User', userSchema);