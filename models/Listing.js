const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    images: Array,
    listing_name: String,
    location: String,
    description: String,
    total_revenue: Number,
    amenities: Array,
    owner: String,
    reviews: Array,
    dates: Array,
    days_reserved: Number,
    reservations: Array
})

module.exports = mongoose.model('Listing', ListingSchema);