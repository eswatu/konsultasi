const Joi = require('joi');
import validateRequest from '../_middleware/validate-request';
import { createTicket, deleteTicketById, getAllTicket, getTicket, updateTicketById }  from '../services/ticket.services';
import authorize from '../_middleware/authorize';
import { Router, Request, Response, NextFunction } from "express";
import { TicketDocument } from "../model/index";
import { FilterQuery } from 'mongoose';

export class TicketRouter {
  public router: Router;
  
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
  
  async getAllTicketDocument(req:Request, res: Response): Promise<void> {
    try {
      console.log('controller call')
      const tickets = await getAllTicket();
      if (tickets === null) {
        res.sendStatus(404);
      } else {
        res.json(tickets);
      }
    } catch (error) {
      res.sendStatus(404).json({message: 'error get tickets'})
    }
  }

  async createTicketDocument(req: Request, res:Response): Promise<void> {
      try {
        if (!req.body) {
          res.sendStatus(400);
        }
        const ticket : TicketDocument = await createTicket(req.body);
        if (ticket === null) {
          res.status(500).json({ success: false, message: 'gagal membuat tiket' });
        }else {
          res.status(201);
        }
      } catch (error) {
         console.log(error);
      }
  }
  async getTicketDocumentById(req:Request<FilterQuery<TicketDocument>>, res: Response): Promise<void> {
    try {
      const ticket = await getTicket(req.params.id)
      if (ticket === null) {
        res.sendStatus(404);
      } else {
        res.json(ticket);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateTicketDocumentById(req:Request, res:Response, next: NextFunction): Promise<void> {
    try {
      const result = await updateTicketById(req.params.id, req.body);
      if (result === null) {
        res.status(500);
      } else {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteTicketDocumentById(req:Request, res:Response, next:NextFunction) {
    try {
      const ticket = await deleteTicketById(req.params.id);
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
    this.router.post('/', this.createSchema, this.createTicketDocument);
    this.router.get('/', this.getAllTicketDocument);
    this.router.get('/:id', this.getTicketDocumentById);
    this.router.put('/:id', this.updateSchema, this.updateTicketDocumentById);
    this.router.delete('/:id', this.deleteTicketDocumentById);
    // this.router.put('/close/:id', authorize(), closeTicket);
  }
}


  
