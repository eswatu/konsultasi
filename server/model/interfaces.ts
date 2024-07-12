import { ObjectId } from "mongoose";

export interface Ticket {
    id: ObjectId;
    dokumen: {
      aju: string;
      daftar: number;
      tanggal: Date;
      nama: string;
    }
    problem: string;
    messages: [Message];
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
  type: string;
  value: string;
  responseTime: Date;
}