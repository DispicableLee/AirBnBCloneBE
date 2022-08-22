const router = require("express").Router();
const User = require("../../models/User");
const Review = require("../../models/Review");
const Listing = require("../../models/Listing");
const Reservations = require("../../models/Reservations");
const ObjectID = require("mongodb").ObjectId;

//POST - create a user
//http://localhost:5002/api/v1/airbnb/create/user
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

//GET - searches for a user from the userObjectID
//http://localhost:5002/api/v1/airbnb/search/user/:userid
router.get("/search/user/:userid", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid)
    const user = await User.findById(userObjectId);
    if(user){
        return res.status(200).send(user)
    }else{
        return res.status(400).send({})
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
        console.log(newListing)
        if(listing){
            return res.status(400).send({})
        }else{
            newListing.save().catch(err=>console.log(err))
            const userArray = user.listings;
            userArray.unshift(newListing._id);
            const userQuery = {_id:user._id};
            const userUpdatedValues = {
                username: user.username,
                email: user.email,
                listings: userArray,
                earnings: user.earnings,
                reservations: user.reservations
            }
            await User.findOneAndUpdate(userQuery, userUpdatedValues)
            return res.status(200).send(newListing);
        }
    }else{
        return res.status(400).send({})
    }
})

//GET - get a single listing document
//http://localhost:5002/api/v1/airbnb/search/single/:listingid
router.get("/search/single/:listingid", async(req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    if(listing){
        return res.status(200).send(listing);
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
    console.log("this is the listing: ", listing);
    console.log("this is the req.body: ", req.body);
    if(listing){
        const newReview = new Review(req.body);
        newReview.save().catch(err=>console.log(err))
        console.log("the new review has been saved")
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
        console.log("this is the new review", newReview)
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

//GET - get all reviews for a listing and converts them into actual documents
//http://localhost:5002/api/v1/airbnb/search/all/reviews/:listingid
router.get("/search/all/reviews/:listingid", async(req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    if(listing){
        const allReviews = [];
        if(listing.reviews.length ==0){
            console.log("there are no reviews for this listing")
        }else{
            for(var i = 0;i<listing.reviews.length;i++){
                const review = await Review.findById(listing.reviews[i])
                allReviews.unshift(review)
            }   
            return res.status(200).send(allReviews);
        }
    }else{
        return res.status(400).send({})
    }
})

//===============================================UPDATES======================================
//PUT - update user's earnings
router.put("/update/earnings/:userid/:earning", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    if(user){
        const earning = req.params.earning;
        const uEarn = user.earnings;
        const newEarn = earning + uEarn;
        const userQuery = {_id:user._id};
        const userUpdatedValues = {
            username: user.username,
            email: user.email,
            listings: user.listings,
            earnings: newEarn,
        }
        await User.findOneAndUpdate(userQuery, userUpdatedValues);
    }else{
        return res.status(400).send
    }
});

//PUT - update a listing

//PUT - edit a review's contents
router.put("/update/content/:reviewid", async(req,res)=>{
    const reviewid = req.params.reviewid;
    const reviewObjectId = ObjectID(reviewid);
    const review = await Review.findById(reviewObjectId);
    if(review){
        //update the review's contents
        const reviewQuery = {_id:review._id};
        const reviewUpdatedValues = {
            user: review.user,
            content: req.body,
            rating: review.rating,
            date: review.date
        }
        await Review.findOneAndUpdate(reviewQuery, reviewUpdatedValues);
        return res.status(200).send(reviewUpdatedValues)
    }else{
        return res.status(400).send({})
    }
})

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
    const user = await User.findById(userObjectId);
    const uList = user.listings;
    //find the listing=================================
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    if(uList.includes(listingObjectId)){
        await Listing.findByIdAndDelete(listingObjectId);
        //now update the user.listings
        const newUlist = uList.filter((id)=>!(listingid.equals(id)))
        const userQuery = {_id:user._id};
        const userUpdatedValues = {
            username: user.username,
            email: user.email,
            listings: newUlist,
            earnings: user.earnings,
        }
        await User.findOneAndUpdate(userQuery, userUpdatedValues);
        return res.status(200).send(userUpdatedValues);
    }else{
        return res.status(400).send({})
    }
})
//DELETE - delete a review
router.delete("/delete/:listingid/:reviewid",async(req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    const listRev = listing.reviews;
    if(listing){
        const reviewid = req.params.reviewid;
        const reviewObjectId = ObjectID(reviewid);
        if(listRev.includes(reviewObjectId)){
            const newRevlist = listRev.filter((id)=>!(reviewid.equals(id)));
            //update the review array
            const listingQuery = {_id:listing._id};
            const listingUpdatedvalues = {
                images: listing.images,
                listing_name: listing.listing_name,
                location: listing.location,
                description: listing.description,
                price_per_night: listing.price_per_night,
                amenities: listing.amenities,
                owner: listing.owner,
                reviews: newRevlist,
                dates: listing.dates,
                days_reserved: listing.days_reserved
            }
            await Listing.findOneAndUpdate(listingQuery, listingUpdatedvalues);
            return res.status(200).send(listingUpdatedvalues);
        }else{
            return res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})

// POST: create a new reservation (you should check if user can even make reservation)
// aka is the date they entered even available for that listing?
//http://localhost:5002/api/v1/airbnb/create/new/reservation/:userid/:listingid
//===============================================TEST LATER==============================================
router.post("/create/new/reservation/:userid/:listingid", async (req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    const userReserves = user.reservations;
    if(user){
        const listingid = req.params.listingid;
        const listingObjectId = ObjectID(listingid);
        const listing = await Listing.findById(listingObjectId);
        const listingDates = listing.dates;
        if(listing){
            //create a new reservation, but do not save it yet
            const newReserve = new Reservations(req.body);
            const resDate = newReserve.dates;
            if(listingDates.includes(resDate)){
                return res.status(400).send({})
            }else{
                //update listing schemas
                const listingReserves = listing.reservations;
                const toRev = listing.total_revenue + newReserve.total_cost;
                console.log(listing);
                console.log(toRev);
                console.log(newReserve);
                listingReserves.unshift(newReserve._id);
                listingDates.unshift(resDate)
                userReserves.unshift(newReserve._id);
                const listingQuery = {_id:listing._id}
                const listingUpdatedvalues = {
                    images: listing.images,
                    listing_name: listing.listing_name,
                    location: listing.location,
                    description: listing.description,
                    total_revenue: toRev,
                    price_per_night: listing.price_per_night,
                    amenities: listing.amenities,
                    owner: listing.owner,
                    reviews: listing.reviews,
                    dates: listingDates,
                    days_reserved: listing.days_reserved,
                    reservations: listingReserves
                }
                await Listing.findOneAndUpdate(listingQuery,listingUpdatedvalues)
                newReserve.save().catch(err=>console.log(err))
                //update userschema
                const userQuery = {_id:user._id};
                const userUpdatedValues = {
                    username: user.username,
                    email: user.email,
                    listings: user.listings,
                    earnings: user.earnings,
                    reservations: userReserves
                }
                await User.findOneAndUpdate(userQuery, userUpdatedValues)
                return res.status(200).send(newReserve)
            }
        }else{
            res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})
// GET: get all reservations that user has booked
router.get("search/all/reservations/:userid", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    if(user){
        const sentList = await Reservations.find({user_id:req.params.userid})
        return res.status(200).send(sentList)
    }else{
        return res.status(400).send({})
    }
})

// GET: get the total profit that a listing has generated from every booking 
router.get("/search/all/earnings/:listingid", async (req,res)=>{
    const listingid = req.params.listingid;
    const listingObjectId = ObjectID(listingid);
    const listing = await Listing.findById(listingObjectId);
    if(listing){
        return res.status(200).send(listing.total_revenue);
    }else{
        return res.status(400).send({})
    }
})
// GET: get the total earnings an user has generated from all listings they own
//this means all the reservations that were booked from each listing
router.get("/search/all/listings/:userid", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    if(user){
        var totalCash = 0
        const listList = user.listings;
        for(var i = 0;i<listList.length;i++){
            //get the document for each objectid
            const listing = await Listing.findById(listList[i])
            const listRev = listing.total_revenue;
            totalCash = totalCash + listRev
        }
        return res.status(200).send(totalCash)
    }else{
        return res.status(400).send({})
    }
})
// PUT: user is updating a current reservation
router.put("/update/reservation/:resid/:userid", async(req,res)=>{
    const resid = req.params.resid;
    const resObjectId = ObjectID(resid);
    const resErve = await Reservations.findById(resObjectId);
    if(resErve){
        const resQuery = {_id:res._id}
        const resUpdatedValues = {
            listing: req.body.listing,
            dates: req.body.dates,
            total_cost: req.body.total_cost,
            days: req.body.days,
            user_id: req.params.userid
        }
        await Reservations.findOneAndUpdate(resQuery, resUpdatedValues);
        return res.status(200).send(resUpdatedValues);
    }else{
        return res.status(400).send({})
    }
})
// DELETE: user has cancelled a  reservation from a listing
router.delete("/delete/reservation/:userid/:listingid/:resid", async(req,res)=>{
    const userid = req.params.userid;
    const userObjectId = ObjectID(userid);
    const user = await User.findById(userObjectId);
    const userReserves = user.reservations
    if(user){
        const listingid = req.params.listingid;
        const listingObjectId = ObjectID(listingid);
        const listing = await Listing.findById(listingObjectId);
        const listingReserves = listing.reservations
        if(listing){
            const resid = req.params.reservationid;
            const resObjectId = ObjectID(resid);
            const res = await Reservations.findById(resObjectId);
            if(listingReserves.includes(resObjectId) && userReserves.includes(resObjectId)){
                await Reservations.findByIdAndDelete(resObjectId);
                //update the listing and user schemas
                const listingQuery = {_id:listing._id};
                const newReserves = listingReserves.filter((id)=>!(resObjectId.equals(id)));
                const userQuery = {_id:user._id};
                const newUreserves = userReserves.filter((id)=>!(resObjectId.equals(id)));
                const toRev = listing.total_revenue - res.total_cost;
                const listingUpdatedvalues = {
                    images: listing.images,
                    listing_name: listing.listing_name,
                    location: listing.location,
                    description: listing.description,
                    total_revenue: toRev,
                    price_per_night: listing.price_per_night,
                    amenities: listing.amenities,
                    owner: listing.owner,
                    reviews: listing.reviews,
                    dates: listing.dates,
                    days_reserved: listing.days_reserved,
                    reservations: newReserves
                }
                const userUpdatedValues = {
                    username: user.username,
                    email: user.email,
                    listings: user.listings,
                    earnings: user.earnings,
                    reservations: newUreserves
                }
                await Listing.findOneAndUpdate(listingQuery, listingUpdatedvalues);
                await User.findOneAndUpdate(userQuery,userUpdatedValues);
                return res.status(200).send(res);
            }else{
                return res.status(400).send({})
            }
        }else{
            return res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})
module.exports = router;



//make 4-5 new reservations

//work on front end