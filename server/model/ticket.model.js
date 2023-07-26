const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    aju: { type: String, required: false },
    nopen: { type: Number, required: false },
    pendate: { type: Date,  required: false },
    name: { type: String, required: true },
    problem: {type: String, required: true},
    isSolved: {type: Boolean, required:true, default: false},
    priority: {type: Boolean, required: true, default: false},
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    },
    },
    {
        timestamps:
            {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    }
);

module.exports = mongoose.model('Ticket', schema);