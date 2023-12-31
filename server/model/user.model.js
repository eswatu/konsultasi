/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true },
  isActive: { type: Boolean, required: true },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model('User', schema);
