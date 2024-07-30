import { FilterQuery, QueryOptions } from "mongoose";
import { TicketDocument, TicketModel } from "../model/index";
// const { paginateTicket } = require('../_helpers/paginate');
export async function createTicket(tk:TicketDocument) {
    try {
      const ticket = await new TicketModel(tk);
      await ticket.save();
      return ticket;
    } catch (error) {
      //
      console.log(error)
    } 
}

export async function getTicket(
  query: FilterQuery<TicketDocument>,
  options: QueryOptions = { lean: true }
) {
    const ticket:TicketDocument = await TicketModel.findOne(query, {}, options);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
}

export async function updateTicketById(id, doc) {
  try {
    const result: TicketDocument = await TicketModel.findOneAndUpdate(
      { _id: id },
      {
        dokumen: doc.dokumen,
        problem: doc.problem
      },
    );
      return result;
  } catch (error) {
    // console.error(error);
    throw error
  }
}

export async function deleteTicketById(id){
    try {
      await  TicketModel.findOneAndUpdate({_id : id}, { deleted: true}).then(result => {
        if (result !== null) {
          return {success: true, message: 'berhasil delete'}
        }
      })
    } catch (error) {
      console.log(error)
    }
}

export async function getAllTicket() {
    console.log('service called')
      return await TicketModel.find();
}
  // ----------------------------------message------------------------------------------------
  // public async createMessage(au, msg) {
  //   const us = await  User.findById(au);
  //   const m =  Message.create({
  //     user: {
  //       id: us.id,
  //       name: us.name,
  //       company: us.company,
  //     },
  //     message: msg.message,
  //     isKey: msg.isKey,
  //     responseTime: new Date(),
  //   });
  //   return m;
  // }
