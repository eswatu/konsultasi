//import express app
const app = require('./app');
//import socket.io
const { createServer } =require ('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    credentials: true
  }
});

// create test user in db on startup if required
if (process.env.NODE_ENV === 'development') {
  const createTestUser = require('_helpers/create-test-user');
  createTestUser();
}

// config.js
const config = {
  production: {
    port: process.env.PORT || 80
  },
  development: {
    port: 4000,
  }
};
// app.js
const env = process.env.NODE_ENV || 'development';
const port = config[env].port;

//server app
httpServer.listen(port, () => {
  console.log('server is running in '+ env);
  console.log(`Server listening on port ${port}`);
});