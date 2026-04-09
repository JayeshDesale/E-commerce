const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "desale_db",
    port: Number(process.env.DB_PORT || 3306)
});

db.connect(err => {
    if (err) {
        console.log("DB connection failed");
        console.error(err);
        return;
    }

    console.log("DB connected");
});

module.exports = db;
