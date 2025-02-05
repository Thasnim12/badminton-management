const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./connections/dbConnection')


const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

(async () => {
    try {
        const db = await connectDB();
        app.locals.db = db;
        console.log("Database connected, starting server...");

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to database. Server not started.");
        process.exit(1);
    }
})();
