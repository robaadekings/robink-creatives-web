const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({message: "Server is healthy"});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});