const User=require("../models/user");
const Listing = require('../models/listing');



module.exports.signUp=async(req,res)=>{  //eben if Wrap Async is there we add try catch insted of only showing error it will automaticluu redirect to sigunup page
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registerdUser=await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings"); 
    });
     
    } catch(e){
        req.flash("error",e.messege);
        res.redirect("/signup");
    }
};


module.exports.logIn=async(req,res)=>{ //passport.authenticate() is MW which autenticate user before post route
    req.flash("success","welcome to wanderlust You Are loggedin");
    let redirectUrl=res.locals.redirectUrl || "/listings"; //Ye iss liye krna pda kyuki jb hum simply login kr rhe the toh apna MW trigger nhi hua so no path in redirecturl  isilye ja uski value ho toh uspe o/w /listings pe
    res.redirect(redirectUrl);
};

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err); 
        }
        req.flash("success","You are Logged Out now");
        res.redirect("/login");
    })
};



module.exports.showLikedListings = async (req, res) => {
    const user = await User.findById(req.params.id).populate('likes'); // Assuming "likes" is an array in your User model referencing listings
    if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('/listings');
    }
    res.render('users/likes', { user });
};