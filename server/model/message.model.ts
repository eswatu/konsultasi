import { Schema, model } from "mongoose";
import { userSchema } from "./user.model";

export const messageSchema = new Schema({
  user: userSchema,
  value: { type: String, required: true, default:'' },
  type: {type: String, required: true}
}, {
  timestamps: {
    createdAt: 'responseTime',
  },
});

messageSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
  },
});
messageSchema.statics.addMessage = (message, callback) => {
  message.save(callback);
};

const MESSAGE = model('Message', messageSchema);
export default MESSAGE;