const express = require('express')
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB')
const authenticateUser = require('./middlewares/jwtVerification');
const { logger } = require('./middlewares/logger');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');


const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// authentication related routes
app.use('/login', require('./routes/auth/login'));
app.use('/register', require('./routes/auth/register'));
app.use('/refresh', require('./routes/auth/refresh'));
app.use('/logout', require('./routes/auth/logout'));
app.use('/validate', require('./routes/auth/fieldValidate'));

// to be protected
app.use(authenticateUser);
app.use('/api/v1/notes', require('./routes/api/notes'));
app.use('/api/v1/folders', require('./routes/api/folders'));



const SERVER_START = async () => {
    try
    {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => { console.log(`Successfully connected to DB!\nServer is listening on port ${PORT}...`) });
    } catch (err) {
        console.log("I am here!");
        console.log(err);
    }
}

SERVER_START();