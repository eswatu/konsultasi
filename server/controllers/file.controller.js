const express = require('express');

const router = express.Router();
const authorize = require('../_middleware/authorize');

const uploadFiles = require('../_middleware/upload');
const ticketService = require('../services/ticket.services');
const fileStorageService = require('../services/filestorage.service');

async function downloadMsgFile(req, res, next) {
  try {
    const ticket = await ticketService.findById(req.params.ticket.id);
    const message = await ticketService.getMessage(ticket, req.params.message.id);
    res.type('application/octet-stream').send(message.message);
  } catch (error) {
    next(error);
  }
}

router.post('/:id', authorize(), uploadFiles.any(), fileStorageService.uploadFilesToServer);
router.get('/:ticketid/:messageid', authorize(), downloadMsgFile);
module.exports = router;
