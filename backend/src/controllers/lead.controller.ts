import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';
import { AuthRequest } from '../middleware/auth';

export class LeadController {
  static async create(req: Request, res: Response) {
    try {
      const lead = await LeadService.create(req.body);
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getMyLeads(req: AuthRequest, res: Response) {
    try {
      const result = await LeadService.getBySellerWithCount(req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const lead = await LeadService.updateStatus(req.params.id, req.userId!, req.body.status);
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
