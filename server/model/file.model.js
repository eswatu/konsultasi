const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  path: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FileStorage', fileSchema);
