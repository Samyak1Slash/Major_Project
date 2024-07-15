const mongoose=require("mongoose");
const intidata=require("./data.js");
const Listing=require("../models/listing.js"); // yaha do dot lagane apde balki app.js mein ek hhi . lagana pada start mein coz this is inside other folder

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})



async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
   await Listing.deleteMany({});
   intidata.data=intidata.data.map((obj)=>({...obj,owner:"66753649000526f15fc88ca3"}))
   await Listing.insertMany(intidata.data);
   console.log("data was initialized");
}

initDB();