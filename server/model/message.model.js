/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const creatorSchema = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  company: String,
});

const schema = new Schema({
  user: creatorSchema,
  message: { type: String, required: true },
  type: { type: String, required: true, default: 'text' },
  time: { type: Date, required: true },
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
schema.statics.addMessage = (message, callback) => {
  message.save(callback);
};
schema.statics.getMessages = (callback) => {
  Message.find({}, callback);
};

module.exports = mongoose.model('Message', schema);
