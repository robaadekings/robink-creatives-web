const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});