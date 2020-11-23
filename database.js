const mongoose = require('mongoose');
require('dotenv').config()

const mongodbUrl = process.env.MONGODB_URL

const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            // database: 'chat'
        });
        console.log("MongoDB database connection established successfully")
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectDB;