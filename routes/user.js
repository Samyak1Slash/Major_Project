const express=require("express");
const router=express.Router();
const User=require("../models/user.js"); 
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../Controller/user.js");
const { isLoggedin } = require("../middleware.js");


// router.get("/signup",(req,res)=>{
//     res.render("users/signup.ejs"); 
// });

// router.post("/signup",wrapAsync(userController.signUp));

router.route("/signup")
.get((req,res)=>{     //getSignUp
    res.render("users/signup.ejs"); 
})
.post(wrapAsync(userController.signUp)); //SignUp



router.route("/login",)
.get((req,res)=>{
    res.render("users/login.ejs");//Get login
})
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.logIn); //Log In


// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// });

router.get('/users/:id/likes', isLoggedin, wrapAsync(userController.showLikedListings));



// router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.logIn);

router.get("/logout",userController.logOut);


module.exports=router;  