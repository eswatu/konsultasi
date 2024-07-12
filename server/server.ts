import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
const cors = require('cors');

const ioapp = require('./socketio');
const errorHandler = require('./_middleware/error-handler');

// import routes
const userController = require('./controllers/user.controller');
const ticketController = require('./controllers/ticket.controller');


dotenv.config()

// init app
const app = express();

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

// app.js
const port  = process.env.PORT;

// server app, tambahi option ya
// const server =
app.listen(port, () => {
  console.log(`server is running in ${process.env.TZ}`);
  console.log(`Server listening on port ${port}`);
});

// const io = ioapp(server);
