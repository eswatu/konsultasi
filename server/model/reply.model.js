const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const creatorSchema = {
    id: String,
    name: String,
    company: String,
};

const schema = new Schema({
    ticket: {
        _id : mongoose.Schema.Types.ObjectId,
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