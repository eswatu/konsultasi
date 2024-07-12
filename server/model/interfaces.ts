import { ObjectId } from "mongoose";

export interface Ticket {
    id: ObjectId;
    aju: string;
    nopen: number;
    pendate: Date;
    name: string;
    problem: string;
    messages: string;
    solver: User;
    creator: User;
  }

export interface User {
    id?: ObjectId;
    name: string;
    username?: string;
    password?: string;
    authentication: {
      passwordHash: string;
      salt: string;
      token: string;
    }
    role?: string;
    company: string;
    contact?: string;
    isActive?:string;
}
export interface authParams {
  username: string;
  password: string;
}
export interface Message {
  id: ObjectId;
  user: User;
  message: string;
  isKey: boolean;
  responseTime: Date;
}