const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creatorSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    company: String,
});

const schema = new Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    creator: creatorSchema,
    message: { type: String, required: true },
    isKey: { type: Boolean, required: true, default: false }
}, {
    timestamps: {
        createdAt: 'responseTime'
    }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});
module.exports = mongoose.model('Reply', schema);
