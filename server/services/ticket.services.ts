import { db } from "../_helpers/db";
import { Request, Response } from "express";
import { Message, Ticket, User } from "../model/interfaces";
// const { paginateTicket } = require('../_helpers/paginate');

export async function createTicket(tk:Ticket) {
    try {
      const ticket = await new db.Ticket(tk);
      await ticket.save();
      return { success: true, message: 'sukses buat tiket', result: ticket };
    } catch (error) {
      return { success: false, message: 'error dalam pembuatan tiket' };
    } 
}

export async function getTicketById(id: string) {
    const ticket = await db.Ticket.findById({_id: id});
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
}
export async function getAllTicket(req) {
    const { query } = req.query;
    return db.Ticket.find();
    // return paginateTicket(db.Ticket, query, req.auth);
}
export async function updateTicket(id: string, ticket: Ticket) {
    try {
      const result = await db.Ticket.updateOne(
        { _id: ticket.id },
        {
          dokumen: ticket.dokumen,
          problem: ticket.problem
        },
      );
      if (result.modifiedCount === 0) {
        return { success: false, message: 'gagal, tiket tidak berubah' };
      }
      return { success: true, message: 'sukses update tiket' };
    } catch (error) {
      // console.error(error);
      return { success: false, message: `eror${error}` };
    }
}
export async function deleteTicket(id: string) {
  try {
    await db.Ticket.deleteOne({_id : id}).then(result => {
      if (result.deletedCount === 1) {
        return {success: true, message: 'berhasil delete'}
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export async function closeTicket(id: string, usr:User) {
  const result = await db.Ticket.updateOne(
    { _id: id },
    { $set: { solver: usr } },
  );
  if (result.modifiedCount === 0) {
    return { success: false, message: 'gagal, tiket tidak tertutup' };
  }
  return { success: true, message: 'sukses tutup tiket', result };
}
// ----------------------------------message------------------------------------------------
async function createMessage(au, msg) {
  const us = await db.User.findById(au);
  const m = db.Message.create({
    user: {
      id: us.id,
      name: us.name,
      company: us.company,
    },
    message: msg.message,
    isKey: msg.isKey,
    responseTime: new Date(),
  });
  return m;
}
// add message to ticket using ticketId
// async function addMessage(au:User, msg:Message) {
//   const m = await createMessage(au, msg);
//   const ticket = await db.Ticket.findById(msg.roomId);
//   ticket.messages.push(m);
//   // console.log('Saving ticket:', ticketId);
//   await ticket.save();
//   // console.log('Message added to ticket:', ticketId);
//   const n = {
//     user: m.user, message: m.message, time: m.time, roomId: msg.roomId,
//   };
//   // console.log('isi n adalah ', n);
//   return n;
// }