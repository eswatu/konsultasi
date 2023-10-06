/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// import express app
require('rootpath')();
const express = require('express');
// const httpsserver = require('https');
// const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ioapp = require('./socketio');
const errorHandler = require('./_middleware/error-handler');

// import routes
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');

// certificate SSL
// const options = {
//   key: fs.readFileSync('./cert/key.pem'),
//   cert: fs.readFileSync('./cert/cert.pem'),
// };
// init app
const app = express();
app.enable('trust proxy');
// eslint-disable-next-line consistent-return
// app.use((request, response, next) => {
//   if (process.env.NODE_ENV !== 'development' && !request.secure) {
//     return response.redirect(`https://${request.headers.host}${request.url}`);
//   }

//   next();
// });

app.use(cors({
  origin: ['http://localhost:4200',
    'https://servicedesk-400808.et.r.appspot.com',
    'http://10.52.44.61:4200',
    '*'],
  credentials: true,
}));

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
// if (process.env.NODE_ENV === 'development') {
// const createTestUser = require('_helpers/create-test-user');
// createTestUser();
// }

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

// server app, tambahi option ya
const server = app.listen(port, () => {
  console.log(`server is running in ${env}`);
  console.log(`Server listening on port ${port}`);
});

const io = ioapp(server);
