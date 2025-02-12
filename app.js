const express = require('express')
const app = express()
require('dotenv').config();
const connectDB = require('./config/connectDB')

const PORT = process.env.PORT || 3001
console.log(PORT);

console.log(process.env.MONGO_URI);

const SERVER_START = async () => {
    try
    {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => { console.log(`Successfully connected to DB!\nServer is listening on port 3000...`) });
    } catch (err) {
        console.log(err);
    }
}

SERVER_START();