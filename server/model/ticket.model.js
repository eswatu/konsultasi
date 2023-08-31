/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema({
  id: String,
  name: String,
  company: String,
});

const schema = mongoose.Schema({
  aju: { type: String, required: false },
  nopen: { type: Number, required: false },
  pendate: { type: Date, required: false },
  name: { type: String, required: true },
  problem: { type: String, required: true },
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
