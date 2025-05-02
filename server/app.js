require('dotenv').config();

const express = require('express')
const cookieParser = require('cookie-parser');
const connectDB = require('./config/connectDB')
const authenticateUser = require('./middlewares/jwtVerification');
const { errLogger } = require('./middlewares/logger');
const { jsonErrorHandler } = require('./middlewares/errHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 3001;


// MIDDLEWARE
app.use(errLogger);
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// authentication related routes
app.use('/api/v1/register', require('./routes/auth/register'));
app.use('/api/v1/login', require('./routes/auth/login'));
app.use('/api/v1/refresh', require('./routes/auth/refresh'));
app.use('/api/v1/logout', require('./routes/auth/logout'));

// Health check, to see if everything is okay
app.get("/", (_, res) => {
    return res.status(200).json({
        status: "Healthy!"
    });
});

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
        console.log(err);
    }
}

// This error handler is the last middleware
app.use(jsonErrorHandler);

SERVER_START();