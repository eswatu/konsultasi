import dotenv from "dotenv";
import express from "express";
import cookieParser from 'cookie-parser';
const cors = require('cors');

import { router as ticketRouter } from "./controllers/ticket.controller";
import { router as userRouter} from "./controllers/user.controller";
import mongoose from "mongoose";
import logger from "./_helpers/logger";
import { expressjwt } from "express-jwt";
const ioapp = require('./socketio');
const errorHandler = require('./_middleware/error-handler');

dotenv.config()

class Server {
  public app : express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.mongoConnect();
  }
  // set rute
  public routes(): void {
  // set routes
    this.app.use('/users', userRouter);
    this.app.use('/tickets', ticketRouter);
  }
  // set konfigurasi
  public config(): void {
    // this.app.use(expressjwt({ secret: process.env.secret, algorithms: ['HS256']}))
    this.app.set('port', process.env.PORT)
    this.app.use(cors({credentials: true, origin:true}));
    // middleware
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cookieParser());

    // global error handler
    // this.app.use(errorHandler);
  }
  // konek ke mongodb
  private mongoConnect(): void {
    const MONGODB_URI: string = process.env.SERVER!;
    const connection = mongoose.connection
    connection.on('connected', () => {
      logger.info('Mongo Connection Established')
    })
    connection.on('reconnected', () => {
      logger.info('Mongo Connection Reestablished')
    })
    connection.on('disconnected', () => {
      logger.info('Mongo Connection Disconnected')
      logger.info('Trying to reconnect to Mongo ...')
      setTimeout(() => {
        mongoose.connect(MONGODB_URI, {
          socketTimeoutMS: 3000,
          connectTimeoutMS: 3000,
        })
      }, 3000)
    })
    connection.on('close', () => {
      logger.info('Mongo Connection Closed')
    })
    connection.on('error', (error: Error) => {
      logger.info('Mongo Connection ERROR: ' + error)
    })

    const run = async () => {
      await mongoose.connect(MONGODB_URI, {dbName: process.env.DBNAME})
    }
    run().catch((error) => console.error(error))
  }
  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      logger.info('API is running at http://localhost:%d', this.app.get('port'))
    })
  }
}

// const io = ioapp(server);
const server = new Server();

server.start();