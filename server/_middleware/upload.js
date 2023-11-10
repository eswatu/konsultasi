// const util = require('util');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log(req);
    const { id } = req.params;
    // eslint-disable-next-line no-undef
    const pathFile = path.join(__dirname, '../resources/uploads', `${id}`);

    if (!fs.existsSync(pathFile)) {
      fs.mkdirSync(pathFile);
    }
    req.filepath = pathFile;
    callback(null, pathFile);
  },
  // eslint-disable-next-line consistent-return
  filename: (req, file, callback) => {
    // const match = ['image/png', 'image/jpeg'];

    // if (match.indexOf(file.mimetype) === -1) {
    //   const message = `${file.originalname} is invalid. Only accept png/jpeg.`;
    //   return callback(message, null);
    // }

    const filename = `${Date.now()}-kts-${file.originalname}`;
    // console.log('dari upload.js ', filename);
    req.filepath += filename;
    callback(null, filename);
  },
});

const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
});
module.exports = uploadFiles;
