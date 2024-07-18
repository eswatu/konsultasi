import { ObjectId, Document } from "mongoose";

export interface ITicket extends Document {
    id: ObjectId;
    dokumen: {
      aju: string;
      daftar: number;
      tanggal: Date;
      nama: string;
    }
    problem: string;
    messages: [IMessage];
    solver: IUser;
    creator: IUser;
  }

export interface IUser extends Document{
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
export interface IMessage extends Document{
  id: ObjectId;
  user: IUser;
  type: string;
  value: string;
  responseTime: Date;
}