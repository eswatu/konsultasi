/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// import express app
require('rootpath')();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ioapp = require('./socketio');
const errorHandler = require('./_middleware/error-handler');

// import routes
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');

// init app
const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'https://fonts.googleapis.com', 'http://192.168.50.253:4200'],
  credentials: true,
  optionsSuccessStatus: 204,
}));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://192.168.50.253:4200'); // update to match the domain you will make the request from
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// set routes
app.use('/users', userController);
app.use('/tickets', ticketController);

// global error handler
app.use(errorHandler);

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  // const createTestUser = require('_helpers/create-test-user');
  // createTestUser();
}

// config.js
const config = {
  production: {
    port: process.env.PORT || 80,
  },
  development: {
    port: 4000,
  },
};
// app.js
const env = process.env.NODE_ENV || 'development';
const { port } = config[env];

// server app
const server = app.listen(port, () => {
  console.log(`server is running in ${env}`);
  console.log(`Server listening on port ${port}`);
});

const io = ioapp(server);
