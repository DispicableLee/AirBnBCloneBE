const router = require("express").Router();
const User = require("../../models/User");
const Review = require("../../models/Review");
const Listing = require("../../models/Listing");
const ObjectID = require("mongodb").ObjectId;
//POST - create a user
router.post("/create/user", async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).send({})
    }else{
        const newUser = new User(req.body)
        newUser.save().catch(err=>console.log(err))
        return res.status(200).send(newUser);
    }
})
//POST - create a listing
//http://localhost:5002/api/v1/airbnb/create/listing/:userid
router.post("/create/listing/:userid", async(req,res)=>{
    //user authentication
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid)
    const user = await User.findById(userObjectId);
    if(user){
        //create listing
        const newListing = new Listing(req.body);
        const loCation = newListing.location;
        const listing = await Listing.findOne({location: loCation})
        if(listing){
            return res.status(400).send({})
        }else{
            newListing.save().catch(err=>console.log(err))
            return res.status(200).send(newListing);
        }
    }else{
        return res.status(400).send({})
    }
})
//POST - create a review
//http://localhost:5002/api/v1/airbnb/create/review/:listingid
router.post("/create/review/:listingid", async(req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    if(listing){
        const newReview = new Review(req.body);
        newReview.save().catch(err=>console.log(err))
        const newReviewId = newReview._id
        const listingQuery = {_id: listing._id}
        const listingReviewArray = listing.reviews;
        listingReviewArray.push(newReviewId)
        const updatedListing = {
                images: listing.images,
                listing_name: listing.listing_name,
                location: listing.location,
                description: listing.description,
                price_per_night: listing.price_per_night,
                amenities: listing.amenities,
                owner: listing.owner,
                reviews: listingReviewArray,
                dates: listing.dates,
                days_reserved: listing.days_reserved
        }
        await Listing.findOneAndUpdate(listingQuery, updatedListing);
        return res.status(200).send(newReview);
    }else{
        return res.status(400).send({})
    }
})

//GET - get all listings
//http://localhost:5002/api/v1/airbnb/search/all/listings
router.get("/search/all/listings", async(req,res)=>{
    const listings = await Listing.find()
    return res.status(200).send(listings)
})

//GET - get all reviews for a listing
//http://localhost:5002/api/v1/airbnb/search/all/reviews/:listingid
router.get("/search/all/reviews/:listingid", async(req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    if(listing){
        const allReviews = listing.reviews;
        if(allReviews.length ==0){
            console.log("there are no reviews for this listing")
        }else{
            return res.status(200).send(allReviews);
        }
    }else{
        return res.status(400).send({})
    }
})
//PUT - update user info

//PUT - update a listing

//PUT - edit a review

//DELETE - delete a user
router.delete("/delete/:userid", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    if(user){
        await User.findByIdAndDelete(userObjectId);
        return res.status(200).send(user);
    }else{
        return res.status(400).send({})
    }
})
//DELETE - delete a listing
router.delete("/delete/:listingid/:userid",async(req,res)=>{
    //define user first to update later======================================
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User
})
//DELETE - delete a review

module.exports = router;