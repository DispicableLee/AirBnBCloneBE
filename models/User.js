const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: String,
    listings: Array,
    earnings: Number,
    reservations: Array
})

module.exports = mongoose.model('User', UserSchema);