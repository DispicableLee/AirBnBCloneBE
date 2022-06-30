const mongoose = require('mongoose');
const uri = 'mongodb+srv://rob123:rob123@cluster0.bvvzaxc.mongodb.net/?retryWrites=true&w=majority'

const connectDB = async () => {
    await mongoose.connect (uri, {
        useUnifiedTopology : true,
        useNewUrlParser : true
    })
    console.log("mongodb has successfully connected");
}

module.exports = connectDB;