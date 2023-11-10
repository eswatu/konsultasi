const db = require('../_helpers/db');
const Message = require('../model/message.model');
const ticketService = require('./ticket.services');

async function uploadFiles(req) {
  try {
    const newfile = new db.FileStorage({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadDate: new Date(),
    });
    await newfile.save();
    return { success: true, result: newfile };
  } catch (error) {
    return { success: false };
  }
}

async function uploadFilesToServer(req, res, next) {
  try {
    // console.log('dari filecontroller: ', req.auth);
    // create message to save in db, and send to client the result
    console.log(req.files);
    const messagecandidate = await uploadFiles(req);
    console.log(messagecandidate);
    if (messagecandidate.result) {
      const senderMsg = await db.User.findById(req.auth.id);
      if (senderMsg) {
        req.files.forEach(async (item) => {
          // console.log(JSON.stringify(item));
          const msgtorecord = new Message({
            user: {
              id: senderMsg.id,
              name: senderMsg.name,
              username: senderMsg.username,
              company: senderMsg.company,
            },
            message: messagecandidate.result.id,
            type: 'file',
            time: new Date(),
          });
          msgtorecord.roomId = req.params.id;
          const svmesg = await ticketService.addMessage(senderMsg.id, msgtorecord);
          res.send(svmesg);
        });
      }
    }
    // end of message recording
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadFilesToServer };
