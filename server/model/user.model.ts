import { Schema, model, Model } from "mongoose";

export interface UserDocument extends Document{
  name: string;
  username: string;
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

export const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, select: false },
  authentication: {
    passwordHash: { type: String, required: true, select: false },
    salt: {type: String, required:true, select: false},
    token: {type: String, select: false}
  },
  role: { type: String, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true, select: false },
  isActive: { type: Boolean, required: true, select: false },
  deleted: {type: Boolean, required: true, default: false, select: false}
}, {
  virtuals: {
    nameandcompany: {
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
    delete doc.id;
    delete ret.id;
    delete ret._id;
  },
});

export const UserModel: Model<UserDocument> = model<UserDocument>('User', userSchema)