import mongoose from "mongoose";
import dotenv from 'dotenv';
import USER from "../model/user.model";
import { TICKET } from "../model/ticket.model";
import MESSAGE from "../model/message.model";

dotenv.config();

const connectionString = process.env.SERVER || 'myurl';
mongoose.Promise = global.Promise;

export function connectToServer() {
  try {
    mongoose.connect(connectionString, {
      serverSelectionTimeoutMS:15000
    });    
  } catch (error) {
    console.log("error terhubung ke server")
  }
  mongoose.connection.on('error', err => {console.log(err);})
}

export function isValidId(id:string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export const db = {
  User: USER,
  Ticket: TICKET,
  Message: MESSAGE
}