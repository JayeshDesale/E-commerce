const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(
    (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
        .split(",")
        .map(server => server.trim())
        .filter(Boolean)
);

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
