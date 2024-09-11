const Listing=require("../models/listing");
const Review=require("../models/reviews");
const Sentiment = require('sentiment'); // Import sentiment analysis library

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect(`/listings`);
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        // Perform sentiment analysis
        const sentiment = new Sentiment();
        const result = sentiment.analyze(newReview.comment); // Assuming `text` is the field in review
        console.log("Review brfore:", newReview);
        console.log("Review text:", newReview.comment);
        newReview.sentimentScore=result.score;
        console.log(result);
        console.log("Review after:", newReview);

        newReview.sentiment = result.score; // Store sentiment score or analysis

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created");
        res.redirect(`/listings/${listing.id}`);
    } catch (err) {
        req.flash("error", "Something went wrong");
        console.error(err);
        res.redirect(`/listings`);
    }
};


// module.exports.createReview=async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview=new Review(req.body.review);
//     newReview.author=req.user._id;
//     listing.reviews.push(newReview);
 
//     await newReview.save();
//     await listing.save();
//     req.flash("success","New Review Created");
//     // console.log(newReview);
//     // console.log(listing);
//     res.redirect(`/listings/${listing.id}`);
// };

module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    // console.log(id);
    // console.log(reviewId);

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    
    res.redirect(`/listings/${id}`);
};
