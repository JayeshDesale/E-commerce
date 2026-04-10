const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/submit", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).send("All fields required");
        }

        await Feedback.create({
            name,
            email,
            message
        });

        res.send("Feedback submitted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Feedback failed");
    }
});

module.exports = router;
