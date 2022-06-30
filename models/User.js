const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: String,
    listings: Array,
    earnings: Number,
})

module.exports = mongoose.model('User', UserSchema);