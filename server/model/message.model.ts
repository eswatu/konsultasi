import { Schema, model } from "mongoose";
import { userSchema, UserDocument } from "./user.model";

export interface MessageDocument extends Document{
  user: UserDocument;
  type: string;
  value: string;
  responseTime: Date;
  isDeleted: boolean;
}

export const messageSchema = new Schema<MessageDocument>({
  user: userSchema,
  value: { type: String, required: true, default:'' },
  type: {type: String, required: true, default: 'text'},
  isDeleted: {type: Boolean, required: true, default: false}
  }, {
  timestamps: {
    createdAt: 'responseTime',
  },
});
