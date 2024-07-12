import { Schema, model } from "mongoose";
import { userSchema } from "./user.model";
import { messageSchema } from "./message.model";

const ticketSchema = new Schema({
  dokumen: {
    aju: { type: String, required: false },
    daftar: { type: Number, required: false, index:true },
    tanggal: { type: Date, required: false },
    nama: {type: string, required: true}
  },
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