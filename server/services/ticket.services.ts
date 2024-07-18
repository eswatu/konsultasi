import { db } from "../_helpers/db";
import { ITicket } from "../model/index";
import { BaseService } from "./baseService";
// const { paginateTicket } = require('../_helpers/paginate');

export class TicketService extends BaseService {
  async create(tk:ITicket): Promise<ITicket> {
    try {
      const ticket = await new db.Ticket(tk);
      await ticket.save();
      return ticket;
    } catch (error) {
      //
      console.log(error)
    } 
  }

  async getbyId(id): Promise<ITicket> {
    const ticket:ITicket = await db.Ticket.findById({_id: id});
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }

  async update(doc): Promise<ITicket> {
    try {
      const result = await db.Ticket.findOneAndUpdate(
        { _id: doc.id },
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
  async delete(id): Promise<void> {
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
  async getAll(): Promise<ITicket[]> {
    // const { query } = req.query;
    try {
      return await db.Ticket.find({});
    } catch (error) {
      throw error;
    }
  }
  
  // ----------------------------------message------------------------------------------------
  async createMessage(au, msg) {
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
}
