import { Schema , model} from "mongoose";

const fileSchema = new Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

const FILE = model('File', fileSchema)
export default FILE;
