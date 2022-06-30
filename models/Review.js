const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    user: String,
    content: String,
    rating: Number,
    date: String
})

module.exports = mongoose.model('Review', ReviewSchema);