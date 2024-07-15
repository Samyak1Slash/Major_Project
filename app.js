if(process.env.NODE_ENV != "production"){ //ye conndition likhne ka yahi mt;lb hai hum apne .env ko sirf devlopment phase mein use krennge production men hum apne credentials share nahi krenge
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")
// const {listingScheme,reviewSchema}=require("./schema.js");
// const Review=require("./models/reviews.js"); 
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const sessionOptions= {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+7*24*60*60*1000, //so ye basicaly apni cookie store keke rkta hai kuch data lik ek baar log in kiya fir 5 min baad dusre tab se website open kii to to login nahi krna pdega baar baar toh ye uski expiry hai
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



//Sala ye cookie ki backchdodi and flash unk Order mein likhn imp hai
app.use(session(sessionOptions));    //ye dono falsh and session ko Apnr Listing and review se pehele likhna hhoga
app.use(flash())//Ye apn filhaal toh apne new listing ke baad pop up krne ke liye

//configuring Strategy
app.use(passport.initialize()); // dekh bhai agar loi bhi cheez samj naa aye to uska documenteion dekhon npm pe express pei sab mil jyga
app.use(passport.session());
passport.use(new LocalStrategy (User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//isme flash ke andar jo arg pass kiya woh actully key hai joh humn as key:val likha in listing .js mein 
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;   //Yaha pe eith the help of locals we store it here so we can access it in ejs
    next();//IMP hai likhna
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"Student",
//     });
//     let registerdUser=await User.register(fakeUser,"helloworld");// for .register chec npm doc and "helloword" is password here
//     res.send(registerdUser);
// });



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")
const { maxHeaderSize } = require("http");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})


async function main(){
    await mongoose.connect(MONGO_URL);
}







app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);  
app.use(express.static(path.join(__dirname,"public")));


app.use("/listings",listingRouter); //mtlbb ab require kren ke baad listing.js ko jb bhi listining ke route pe koi req aaygi apn listings ko call kr denge

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:"1200",
//         location:"Calangute,goa",
//         country:"India"
//     })

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");  
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let{status=500,message="Some thing went wrong"}=err;   //ye equal to likh ke unik default value set krdi
    res.status(status).render("listings/error.ejs",{err});
    // res.status(status).send(message);
})

app.listen("8000",()=>{
    console.log("Server is listining to port");
})