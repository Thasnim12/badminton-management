const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')

dotenv.config();

const uri = process.env.MONGO_URI

async function connectDB() {
    try {
        const client = await MongoClient.connect(uri);
        console.log(`Connected to MongoDB at: ${client.s.url}`);
        return client.db("Badminton_booking");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = connectDB;
