import { Schema, model, Model } from "mongoose";
import { UserDocument, userSchema } from "./user.model";
import { messageSchema, MessageDocument } from "./message.model";

export interface TicketDocument extends Document {
  dokumen: {
    aju: string;
    daftar: number;
    tanggal: Date;
    nama: string;
  }
  problem: string;
  messages: [MessageDocument];
  solver: UserDocument;
  creator: UserDocument;
  deleted: boolean;
}

const ticketSchema = new Schema<TicketDocument>({
  dokumen: {
    aju: { type: String, required: false },
    daftar: { type: Number, required: false, index:true },
    tanggal: { type: Date, required: false },
    nama: {type: String, required: true}
  },
  problem: { type: String, required: true },
  messages: {type: [messageSchema], default: [], required: false},
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

export const TicketModel : Model<TicketDocument> = model<TicketDocument>('Ticket', ticketSchema);