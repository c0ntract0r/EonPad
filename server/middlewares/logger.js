const { format } = require('date-fns');
// v7 as uuid - UNIX Epoch time-based UUID
const { v7:uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const LOGPATH = path.join(__dirname, '..', 'logs');

// REUSABLE LOG GENERATOR FUNCTION
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), '[dd-MM-yyyy HH:mm:ss]')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    const FILEPATH = path.join(LOGPATH, logFileName);

    // if folder does not exist, create it
    try {
        if (!fs.existsSync(LOGPATH)) await fsPromises.mkdir(LOGPATH);
        await fsPromises.appendFile(FILEPATH, logItem);
    } catch(err) {
        console.log(err);
    }
}



// WHAT to log - Excessive logging can impact performance
const logger = (req, res, next) => {
    // TO MAKE MORE MEANINGFUL LATER
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqlog.log');
    next();
}

module.exports = { logEvents, logger };