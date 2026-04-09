const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("./db");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/order");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const PORT = process.env.PORT || 3000;
const clientPath = path.join(__dirname, "..", "client");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/api/health", (req, res) => {
    res.send("DE-SALE backend is running");
});

app.use(express.static(clientPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
