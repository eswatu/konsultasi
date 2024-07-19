const Joi = require('joi');
import validateRequest from '../_middleware/validate-request';
import { TicketService }  from '../services/ticket.services';
import authorize from '../_middleware/authorize';
import { Router, Request, Response, NextFunction } from "express";
import { ITicket } from '../model';

export class TicketRouter {
  public router: Router;
  public ticketService: TicketService = new TicketService();
  
  constructor() {
    this.router = Router();
    this.routes();
  }
  createSchema(req, res, next) {
    const schema = Joi.object({
      dokumen: {
        aju: Joi.string().allow(null, ''),
        daftar: Joi.number().allow(null, ''),
        tanggal: Joi.date().allow(null, ''),
        nama: Joi.string().required(),
      },
      problem: Joi.string().required(),
      // nanti tambahkan creator
    });
    validateRequest(req, next, schema);
  }
  
  updateSchema(req, res, next) {
    const schema = Joi.object({
      dokumen: {
        aju: Joi.string().allow(null, ''),
        daftar: Joi.number().allow(null, ''),
        tanggal: Joi.date().allow(null, ''),
        nama: Joi.string().required(),
      },
      problem: Joi.string().allow(null, ''),
    });
    validateRequest(req, next, schema);
  }
  async getAllTicket(req:Request, res: Response): Promise<void> {
    try {
      const tickets: ITicket[] = await this.ticketService.getAll()
      if (tickets.length < 1) {
        res.sendStatus(404)
      } else {
        res.json(tickets);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async createTicket(req: Request, res:Response): Promise<void> {
      try {
        if (!req.body) {
          res.sendStatus(400);
        }
        const ticket : ITicket = await this.ticketService.create(req.body);
        if (ticket === null) {
          res.status(500).json({ success: false, message: 'gagal membuat tiket' });
        }else {
          res.status(201);
        }
      } catch (error) {
         console.log(error);
      }
  }
  async getTicketById(req:Request, res: Response): Promise<void> {
    try {
      const ticket = await this.ticketService.getbyId(req.params.id)
      if (ticket === null) {
        res.sendStatus(404);
      } else {
        res.json(ticket);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateById(req:Request, res:Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.ticketService.update(req.params.id, req.body);
      if (result === null) {
        res.status(500);
      } else {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req:Request, res:Response, next:NextFunction) {
    try {
      const ticket = await this.ticketService.delete(req.params.id);
      if (ticket === null ) {
        res.sendStatus(500)
      } else {
        res.json({message: 'berhasil hapus'})
      }
      res.json({ message: 'berhasil hapus tiket' });
    } catch (error) {
      next(error);
    }
  }

  routes() {
    this.router.post('/', this.createSchema, this.createTicket);
    this.router.get('/', this.getAllTicket);
    this.router.get('/:id', this.getTicketById);
    this.router.put('/:id', this.updateSchema, this.updateById);
    this.router.delete('/:id', this.deleteById);
    // this.router.put('/close/:id', authorize(), closeTicket);
  }
}


  
