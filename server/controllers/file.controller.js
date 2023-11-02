const express = require('express');
const db = require('../_helpers/db');

const router = express.Router();
const authorize = require('../_middleware/authorize');
const Message = require('../model/message.model');

const uploadFiles = require('../_middleware/upload');
const ticketService = require('../services/ticket.services');
// const fileStorageService = require('../services/filestorage.service');

async function uploadFilesToServer(req, res, next) {
  try {
    // console.log('dari filecontroller: ', req.auth);
    // create message to save in db, and send to client the result
    // id auth
    const senderMsg = await db.User.findById(req.auth.id);
    req.files.forEach(async () => {
      // console.log(JSON.stringify(item));
      const msgtorecord = new Message({
        user: {
          id: senderMsg.id,
          name: senderMsg.name,
          username: senderMsg.username,
          company: senderMsg.company,
        },
        message: 'download',
        type: 'file',
        time: new Date(),
      });
      msgtorecord.roomId = req.params.id;
      const svmesg = await ticketService.addMessage(senderMsg.id, msgtorecord);
      res.send(svmesg);
    });
    // end of message recording
  } catch (error) {
    next(error);
  }
}
async function downloadMsgFile(req, res, next) {
  console.log(req);
  try {
    const ticket = await ticketService.findById(req.params.ticket.id);
    const message = await ticketService.getMessage(ticket, req.params.message.id);
    res.send(message.message);
  } catch (error) {
    next(error);
  }
}

router.post('/:id', authorize(), uploadFiles.any(), uploadFilesToServer);
router.get('/:ticketid/:messageid', authorize(), downloadMsgFile);
module.exports = router;
