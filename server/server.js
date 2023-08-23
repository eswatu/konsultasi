require('rootpath')();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');
const replyController = require('./controllers/reply.controller');

const { createServer } =require ('http');
const { Server } = require('socket.io');
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/chat/',
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (message) => {
    console.log(message);
    io.emit('message', `${socket.id.substr(0, 2)}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});
io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
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
    port: 4000,
    sport:3800
  }
};
// app.js
const env = process.env.NODE_ENV || 'development';
const port = config[env].port;
const sport = config[env].sport;
//server socket
httpServer.listen(sport, () => {
  console.log(`server socket is running on port ${sport}`);
});
//server app
app.listen(port, () => {
  console.log('server is running in '+ env);
  console.log(`Server listening on port ${port}`);
});