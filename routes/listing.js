const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");     //in saare path ko iss folder ke hisaabs se arrange kiya
// const ExpressError=require("../utils/ExpressError.js"); 
// const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const flash=require("connect-flash");
// const methodOverride=require("method-override"); 
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../Controller/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer ({storage});



router.route("/")
.get(wrapAsync(listingController.index)) //Index Route
.post(
    isLoggedin,                          //Posting newly created Route
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createNewListing)
)

router.route("/search")
.get(listingController.searchListing);


// CREATE NEW AND ADD
 //****VIIMPP isme upar joh show route hai woh /listings/:id aise likha hai toh ye error isliye dee rha hai kyuki ye /new ko varible samj raha hai to to remove confusion we will write this route above SHOW ROUTE */
 router.get("/new",isLoggedin,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListings)) //Show Route
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing)) //Update route
.delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing)); //Delete




// //Index Route
// router..get("/",wrapAsync(listingController.index))
// //Create 

// router.post("/",
    // isLoggedin,
    // validateListing,
    // wrapAsync(listingController.createNewListing));




// //SHOW ROUTE

// router.get("/:id",wrapAsync(listingController.showListings));



//EDIT ROUTE

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editListing));




//Update
// router.put("/:id",isLoggedin,isOwner,validateListing,wrapAsync(listingController.updateListing));



//DELETE

// router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteListing));


//SEARCH

//Like or Unlike
router.post('/:id/like', isLoggedin, listingController.likeListing);





module.exports=router;