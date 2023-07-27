const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const creatorSchema = new Schema({
    id: String,
    name: String,
    company: String,
    role: String
});

const schema = new Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    creator: creatorSchema,
    message: { type: String,  required: false },
    isKey: {type: Boolean, required: true, default: false}
}, {
    timestamps: {
        createdAt: 'responseTime'
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    },
    },

);

module.exports = mongoose.model('Reply', schema);