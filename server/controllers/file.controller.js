const fs = require('fs');
const path = require('path');
const File = require('../models/File');

module.exports = {
  uploadFile: async (req, res) => {
    try {
      const files = req.files;

      for (const file of files) {
        const { filename, originalname, mimetype, size } = file;
        const newFile = new File({
          filename,
          originalName: originalname,
          mimeType: mimetype,
          size
        });
        await newFile.save();
      }

      return res.status(200).json({ message: 'Files uploaded successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  downloadFile: async (req, res) => {
    try {
      const fileId = req.params.id;

      const file = await File.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      const filePath = path.join(__dirname, '../uploads/', file.filename);
      const stream = fs.createReadStream(filePath);

      res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}`);
      res.setHeader('Content-Type', file.mimeType);

      stream.pipe(res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
};
