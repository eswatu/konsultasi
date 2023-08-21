require('rootpath')();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');
const replyController = require('./controllers/reply.controller');

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  const createTestUser = require('_helpers/create-test-user');
  createTestUser();
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

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
  console.log('server is running in '+ env);
    console.log(`Server listening on port ${port}`);
});