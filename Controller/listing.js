const Listing=require("../models/listing.js");
const User=require("../models/user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;   
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

// module.exports.showListings=async(req,res)=>{
//     let {id}=req.params;
//     // abhi .populate("review") se humne kuch aur likha just ike nieech toh use nested populate kehetehai means haar ek review ke lliye auther ki value
//     const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); // ye joh varible bnae udhar pass kiya isis se listing. -- aise acces kiye show.ejs mein
//     if(!listing){
//         req.flash("error","Listing you requested for is does not exists!!");
//         res.redirect("/listings");
//     }
//     res.render("listings/show.ejs",{listing});
// };

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const filter = req.query.filter; // Get the filter type from query parameters

    // Fetch the listing with reviews and owner populated
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!!");
        return res.redirect("/listings");
    }

    // Filter reviews based on sentiment score
    if (filter === 'positive') {
        listing.reviews = listing.reviews.filter(review => review.sentimentScore > 0);
    } else if (filter === 'negative') {
        listing.reviews = listing.reviews.filter(review => review.sentimentScore < 0);
    } else if (filter === 'neutral') {
        listing.reviews = listing.reviews.filter(review => review.sentimentScore === 0);
    }

     

    // Render the listing view with filtered reviews
    res.render("listings/show.ejs", { listing });
};


module.exports.createNewListing=async(req,res,next)=>{ 
    
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    // console.log(req.body);
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
    
    newListing.owner=req.user._id; //ye tab jb new user koi add kree 
    newListing.image={url,filename}; 
    newListing.geometry=response.body.features[0].geometry;
    let saved=await newListing.save();  
    console.log(saved);
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};

module.exports.editListing=async (req,res)=>{// isme bhi apna mW daal diya taki anyone(except owner)log form tk na sccess kr pye
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing=async (req,res)=>{
    console.log("req Recieved");
    let {id}=req.params;
    
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing}); //basically req.body is obj we deconstruct it using ... and proviing the value

    //logic after editing with new image
    
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

    module.exports.searchListing=async(req,res)=>{
        const {searchTerm} = req.query;
        console.log(`Received search term: ${searchTerm}`); // Log the search term
        try {
            if (!searchTerm) {
                return req.flash('Search term is required');
            }
    
            // Perform a regex search to avoid ObjectId casting issues
            const listings = await Listing.find({
                title: { $regex: searchTerm, $options: 'i' } // Use 'title' as the field for searching
            });
    
            console.log(`Search results: ${listings}`); // Log the results
            res.render("listings/search.ejs",{listings});

        } catch (error) {
            console.error(`Error during search: ${error}`); // Error log
            res.status(500).send('Internal Server Error');
        }

 };


 module.exports.likeListing = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Get the current logged-in user
    const listing = await Listing.findById(id);
    const user = await User.findById(userId);

    // If the listing is already liked, unlike it
    if (user.likes.includes(id)) {
        user.likes.pull(id); // Remove listing from likes
    } else {
        user.likes.push(id); // Add listing to likes
    }

    await user.save();
    res.redirect(`/listings/${id}`);
};

