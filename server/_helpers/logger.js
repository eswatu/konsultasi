const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.simple(), // Choose a log format
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'app.log' }) // Log to a file
  ],
});

// Define custom log levels and their colors (optional)
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
});

module.exports = logger;