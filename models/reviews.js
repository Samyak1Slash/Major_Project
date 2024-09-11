const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// const reviewSchema=new Schema({
//     comment:String,
//     rating:{
//         type:Number,
//         min:1,
//         max:5,
//     },
//     createdAt:{
//         type:Date,
//         default:Date.now(),
//     },
//     author:{
//         type:Schema.Types.ObjectId,
//         ref:"User",
//     }
// });

//SENTIMENT ANALYSIS KE LFDE
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    sentimentScore: {  // New field for storing the sentiment score
        type: Number,
        default: 0,  // Default can be 0 (neutral), but you'll update this after analysis
    },
});


const Review=mongoose.model("Review",reviewSchema);
module.exports= Review;