/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  company: String,
});

const schema = mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  creator: creatorSchema,
  message: { type: String, required: true },
  isKey: { type: Boolean, required: true, default: false },
}, {
  timestamps: {
    createdAt: 'responseTime',
  },
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
