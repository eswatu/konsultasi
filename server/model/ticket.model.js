const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creatorSchema = {
    id: String,
    name: String,
    company: String
};

const schema = new Schema({
    aju: { type: String, required: false },
    nopen: { type: Number, required: false },
    pendate: { type: Date,  required: false },
    name: { type: String, required: true },
    problem: {type: String, required: true},
    isSolved: {type: Boolean, required:true, default: false},
    creator: creatorSchema
    },{
    timestamps: true
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
schema.index({aju:'text',nopen: Number, name: 'text', problem: 'text'});

module.exports = mongoose.model('Ticket', schema);