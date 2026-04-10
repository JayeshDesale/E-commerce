const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/desale_db";

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log("MongoDB connection failed");
        console.error(err);
    });

module.exports = mongoose;
