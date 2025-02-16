const express = require('express')
require('dotenv').config();

const connectDB = require('./config/connectDB')
const authenticateUser = require('./middlewares/jwtVerification');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());


app.use('/login', require('./routes/auth'));
app.use('/register', require('./routes/register'));
// to be protected
app.use('/notes', authenticateUser , require('./routes/notes'));




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