const Listing=require("../models/listing");
const Review=require("../models/reviews");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");
    // console.log(newReview);
    // console.log(listing);
    res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    // console.log(id);
    // console.log(reviewId);

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    
    res.redirect(`/listings/${id}`);
};
