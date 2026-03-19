import { Request, Response } from 'express';
import { CarService } from '../services/car.service';
import { AuthRequest } from '../middleware/auth';

export class CarController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const imageUrls = req.files
        ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
        : [];

      const carData = {
        ...req.body,
        userId: req.userId,
        price: parseFloat(req.body.price),
        year: parseInt(req.body.year),
        mileage: req.body.mileage ? parseInt(req.body.mileage) : undefined,
      };

      const car = await CarService.create(carData, imageUrls);
      res.status(201).json(car);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async findAll(req: Request, res: Response) {
    try {
      const result = await CarService.findAll({
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
        make: req.query.make as string,
        model: req.query.model as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        minYear: req.query.minYear ? parseInt(req.query.minYear as string) : undefined,
        maxYear: req.query.maxYear ? parseInt(req.query.maxYear as string) : undefined,
        bodyType: req.query.bodyType as any,
        condition: req.query.condition as any,
        transmission: req.query.transmission as any,
        fuelType: req.query.fuelType as any,
        city: req.query.city as string,
        state: req.query.state as string,
        status: req.query.status as any,
        sort: req.query.sort as string,
        search: req.query.search as string,
        featured: req.query.featured === 'true',
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const car = await CarService.findById(req.params.id);
      await CarService.incrementViews(req.params.id);
      res.json(car);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const car = await CarService.update(req.params.id, req.userId!, req.body);
      res.json(car);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const result = await CarService.delete(req.params.id, req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async addImages(req: AuthRequest, res: Response) {
    try {
      const imageUrls = req.files
        ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
        : [];
      const car = await CarService.addImages(req.params.id, req.userId!, imageUrls);
      res.json(car);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteImage(req: AuthRequest, res: Response) {
    try {
      const result = await CarService.deleteImage(req.params.imageId, req.userId!);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const result = await CarService.toggleFavorite(req.userId!, req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getFavorites(req: AuthRequest, res: Response) {
    try {
      const cars = await CarService.getFavorites(req.userId!);
      res.json(cars);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getSimilar(req: Request, res: Response) {
    try {
      const cars = await CarService.getSimilar(req.params.id);
      res.json(cars);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const stats = await CarService.getDashboardStats(req.userId!);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getMyListings(req: AuthRequest, res: Response) {
    try {
      const result = await CarService.findAll({
        userId: req.userId,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
        status: req.query.status as any,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getMakes(req: Request, res: Response) {
    try {
      const makes = await CarService.getMakes();
      res.json(makes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getModels(req: Request, res: Response) {
    try {
      const models = await CarService.getModelsByMake(req.params.make);
      res.json(models);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
