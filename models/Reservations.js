const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    //the listing the reservation was made for
    listing: String,
    dates: String,
    total_cost: Number,
    days: Number,
    //the id of the user who made the reservation
    user_id: String
})

module.exports = mongoose.model('Reservation', ReservationSchema);