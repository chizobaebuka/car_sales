import { AppDataSource } from '../config/database';
import { Lead, LeadStatus } from '../models/Lead';

const leadRepository = () => AppDataSource.getRepository(Lead);

export class LeadService {
  static async create(data: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone?: string;
    message?: string;
    carId: string;
    sellerId: string;
  }) {
    const lead = leadRepository().create(data);
    return leadRepository().save(lead);
  }

  static async getBySellerWithCount(sellerId: string) {
    const [leads, total] = await leadRepository().findAndCount({
      where: { sellerId },
      relations: ['car', 'car.images'],
      order: { createdAt: 'DESC' },
    });
    return { leads, total };
  }

  static async updateStatus(id: string, sellerId: string, status: LeadStatus) {
    const lead = await leadRepository().findOne({ where: { id, sellerId } });
    if (!lead) throw new Error('Lead not found');
    lead.status = status;
    return leadRepository().save(lead);
  }
}
