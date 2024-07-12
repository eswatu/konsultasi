import { Schema, model } from "mongoose";

export const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true, select: false },
  authentication: {
    passwordHash: { type: String, required: true, select: false },
    salt: {type: String, required:true, select: false},
    token: {type: String, select: false}
  },
  role: { type: String, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true, select: false },
  isActive: { type: Boolean, required: true, select: false },
}, {
  virtuals: {
    getNameAndCompany: {
      get() {
        return this.name + ' ' + this.company
      }
    }
  }
  }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

const USER = model('User', userSchema)
export default USER;
