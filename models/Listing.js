const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    images: Array,
    listing_name: String,
    location: String,
    description: String,
    price_per_night: Number,
    amenities: Array,
    owner: String,
    reviews: Array,
    dates: String,
    days_reserved: Number
})

module.exports = mongoose.model('Listing', ListingSchema);