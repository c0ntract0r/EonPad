const express = require('express');
const app = express();
require('dotenv').config()


const PORT = process.env.PORT || 3001

const SERVER_START = async () => {
    app.listen(PORT, () => { console.log(`Server is listening on port 3000...`) });
}

SERVER_START();