import { FilterQuery, QueryOptions } from "mongoose";
import { TicketDocument, TicketModel } from "../model/index";
import logger from "../_helpers/logger";
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

export async function getTicketById(q:
  FilterQuery<TicketDocument>
) {
  logger.info(q);
    const ticket = await TicketModel.findOne(q);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
}

export async function updateTicketById(id: string, doc: TicketDocument) {
  try {
    const result = await TicketModel.findByIdAndUpdate(
      id,
      { $set: { dokumen : doc.dokumen, problem : doc.problem} }, {new: true, runValidators: true }
    );
    // logger.info(result);
      return result;
  } catch (error) {
    // console.error(error);
    throw error
  }
}

export async function deleteTicketById(id:string){
    try {
      await TicketModel.findOneAndUpdate({_id : id}, { deleted: true}).then(result => {
        if (result !== null) {
          return {success: true, message: 'berhasil delete'}
        }
      })
    } catch (error) {
      console.log(error)
    }
}

export async function getAllTicket() {
    // console.log('service called')
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
