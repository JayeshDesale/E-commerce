const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/submit", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send("All fields required");
    }

    const sql =
        "INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], err => {
        if (err) {
            console.error(err);
            return res.status(500).send("Feedback failed");
        }
        res.send("Feedback submitted successfully");
    });
});

module.exports = router;
