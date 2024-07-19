import { db } from "../_helpers/db";
import { ITicket } from "../model/index";
import { BaseService } from "./baseService";
// const { paginateTicket } = require('../_helpers/paginate');

export class TicketService extends BaseService {
  
  public async create(tk:ITicket): Promise<ITicket> {
    try {
      const ticket = await new db.Ticket(tk);
      await ticket.save();
      return ticket;
    } catch (error) {
      //
      console.log(error)
    } 
  }
  public async getbyId(id): Promise<ITicket> {
    const ticket:ITicket = await db.Ticket.findById({_id: id});
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }
  public async update(id, doc): Promise<ITicket> {
    try {
      const result: ITicket = await db.Ticket.findOneAndUpdate(
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
  public async delete(id): Promise<void> {
    try {
      await db.Ticket.findOneAndUpdate({_id : id}, { deleted: true}).then(result => {
        if (result !== null) {
          return {success: true, message: 'berhasil delete'}
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  public async getAll(): Promise<ITicket[]> {
    // const { query } = req.query;
    try {
      return await db.Ticket.find({});
    } catch (error) {
      throw error;
    }
  }
  // ----------------------------------message------------------------------------------------
  public async createMessage(au, msg) {
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
