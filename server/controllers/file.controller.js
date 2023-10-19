const express = require('express');

const router = express.Router();

const uploadFiles = require('../_middleware/upload');
// const fileStorageService = require('../services/filestorage.service');

async function uploadFilesToServer(req, res, next) {
  try {
    // console.log(req);
    res.send('ok');
  } catch (error) {
    next(error);
  }
}

router.post('/:id', uploadFiles.array('files', 20), uploadFilesToServer);
module.exports = router;
