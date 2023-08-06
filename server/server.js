require('rootpath')();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  const createTestUser = require('_helpers/create-test-user');
  createTestUser();
}

const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');
const replyController = require('./controllers/reply.controller');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//create set of allowed origins
const allowedOrigins = new Set(['http://localhost:4200', 'https://localhost:4200']);
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// api routes
app.use('/users', userController);
app.use('/tickets', ticketController);
app.use('/replies', replyController);

// global error handler
app.use(errorHandler);

// config.js
const config = {
  production: {
    port: process.env.PORT || 80
  },
  development: {
    port: 4000
  }
};

// app.js
const env = process.env.NODE_ENV || 'development';
const port = config[env].port;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});