import { Schema, model, Model } from "mongoose";
import { ITicket } from "./interfaces";
import { userSchema } from "./user.model";
import { messageSchema } from "./message.model";

const ticketSchema = new Schema<ITicket>({
  dokumen: {
    aju: { type: String, required: false },
    daftar: { type: Number, required: false, index:true },
    tanggal: { type: Date, required: false },
    nama: {type: String, required: true}
  },
  problem: { type: String, required: true },
  messages: [messageSchema],
  solver: userSchema,
  creator: userSchema,
  deleted: {type: Boolean, required: true, default: false, select: false }
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

export const TICKET : Model<ITicket> = model<ITicket>('Ticket', ticketSchema);