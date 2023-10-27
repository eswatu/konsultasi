/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const messageSchema = require('./message.model').schema;

const { Schema } = mongoose;

const creatorSchema = new Schema({
  id: String,
  name: String,
  username: String,
  company: String,
});
// const messageSchema = new Schema({
//   user: creatorSchema,
//   message: { type: String, required: true },
//   time: { type: Date, required: true },
// });

const schema = new Schema({
  aju: { type: String, required: false },
  nopen: { type: Number, required: false },
  pendate: { type: Date, required: false },
  name: { type: String, required: true },
  problem: { type: String, required: true },
  messages: [{ type: messageSchema }],
  solver: creatorSchema,
  isSolved: { type: Boolean, required: true, default: false },
  creator: creatorSchema,
}, {
  timestamps: true,
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // remove these props when object is serialized
    delete ret._id;
  },
});
schema.index({
  aju: 'text', nopen: Number, name: 'text', problem: 'text',
});

module.exports = mongoose.model('Ticket', schema);
