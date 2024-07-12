import { Schema, model } from "mongoose";
import { userSchema } from "./user.model";
import { messageSchema } from "./message.model";

const ticketSchema = new Schema({
  aju: { type: String, required: false },
  nopen: { type: Number, required: false, index:true },
  pendate: { type: Date, required: false },
  name: { type: String, required: true },
  problem: { type: String, required: true },
  messages: [messageSchema],
  solver: userSchema,
  creator: userSchema,
}, {
  timestamps: true,
});

ticketSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    // remove these props when object is serialized
    delete ret._id;
  },
});

const TICKET = model('Ticket', ticketSchema);
export default TICKET;