import { AppDataSource } from '../config/database';
import { Car, CarStatus, BodyType, CarCondition, TransmissionType, FuelType } from '../models/Car';
import { CarImage } from '../models/CarImage';
import { Favorite } from '../models/Favorite';
import { Like, Between, In, ILike, FindOptionsWhere } from 'typeorm';

const carRepository = () => AppDataSource.getRepository(Car);
const imageRepository = () => AppDataSource.getRepository(CarImage);
const favoriteRepository = () => AppDataSource.getRepository(Favorite);

export class CarService {
  static async create(data: Partial<Car>, imageUrls: string[]) {
    const car = carRepository().create(data);
    const saved = await carRepository().save(car);

    if (imageUrls.length > 0) {
      const images = imageUrls.map((url, index) =>
        imageRepository().create({
          url,
          isPrimary: index === 0,
          carId: saved.id,
        })
      );
      await imageRepository().save(images);
    }

    return this.findById(saved.id);
  }

  static async findAll(query: {
    page?: number;
    limit?: number;
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    bodyType?: BodyType;
    condition?: CarCondition;
    transmission?: TransmissionType;
    fuelType?: FuelType;
    city?: string;
    state?: string;
    status?: CarStatus;
    sort?: string;
    search?: string;
    featured?: boolean;
    userId?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Car> = {};

    if (query.make) where.make = ILike(`%${query.make}%`);
    if (query.model) where.model = ILike(`%${query.model}%`);
    if (query.bodyType) where.bodyType = query.bodyType;
    if (query.condition) where.condition = query.condition;
    if (query.transmission) where.transmission = query.transmission;
    if (query.fuelType) where.fuelType = query.fuelType;
    if (query.city) where.city = ILike(`%${query.city}%`);
    if (query.state) where.state = ILike(`%${query.state}%`);
    if (query.status) where.status = query.status;
    else where.status = CarStatus.ACTIVE;
    if (query.featured) where.featured = true;
    if (query.userId) where.userId = query.userId;

    let order: any = { createdAt: 'DESC' };
    if (query.sort === 'price_asc') order = { price: 'ASC' };
    if (query.sort === 'price_desc') order = { price: 'DESC' };
    if (query.sort === 'year_desc') order = { year: 'DESC' };
    if (query.sort === 'year_asc') order = { year: 'ASC' };
    if (query.sort === 'views') order = { views: 'DESC' };

    const qb = carRepository()
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('car.user', 'user')
      .select([
        'car',
        'images',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phone',
        'user.businessName',
        'user.verified',
        'user.avatar',
        'user.createdAt',
      ]);

    // Apply where conditions
    if (query.make) qb.andWhere('car.make ILIKE :make', { make: `%${query.make}%` });
    if (query.model) qb.andWhere('car.model ILIKE :model', { model: `%${query.model}%` });
    if (query.bodyType) qb.andWhere('car.bodyType = :bodyType', { bodyType: query.bodyType });
    if (query.condition) qb.andWhere('car.condition = :condition', { condition: query.condition });
    if (query.transmission) qb.andWhere('car.transmission = :transmission', { transmission: query.transmission });
    if (query.fuelType) qb.andWhere('car.fuelType = :fuelType', { fuelType: query.fuelType });
    if (query.city) qb.andWhere('car.city ILIKE :city', { city: `%${query.city}%` });
    if (query.state) qb.andWhere('car.state ILIKE :state', { state: `%${query.state}%` });
    if (query.featured) qb.andWhere('car.featured = :featured', { featured: true });
    if (query.userId) qb.andWhere('car.userId = :userId', { userId: query.userId });
    if (query.minPrice) qb.andWhere('car.price >= :minPrice', { minPrice: query.minPrice });
    if (query.maxPrice) qb.andWhere('car.price <= :maxPrice', { maxPrice: query.maxPrice });
    if (query.minYear) qb.andWhere('car.year >= :minYear', { minYear: query.minYear });
    if (query.maxYear) qb.andWhere('car.year <= :maxYear', { maxYear: query.maxYear });
    if (query.search) {
      qb.andWhere('(car.make ILIKE :search OR car.model ILIKE :search OR car.description ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    if (query.status) {
      qb.andWhere('car.status = :status', { status: query.status });
    } else {
      qb.andWhere('car.status = :status', { status: CarStatus.ACTIVE });
    }

    // Apply order
    if (query.sort === 'price_asc') qb.orderBy('car.price', 'ASC');
    else if (query.sort === 'price_desc') qb.orderBy('car.price', 'DESC');
    else if (query.sort === 'year_desc') qb.orderBy('car.year', 'DESC');
    else if (query.sort === 'year_asc') qb.orderBy('car.year', 'ASC');
    else if (query.sort === 'views') qb.orderBy('car.views', 'DESC');
    else qb.orderBy('car.createdAt', 'DESC');

    const [cars, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      cars,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findById(id: string) {
    const car = await carRepository()
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('car.user', 'user')
      .select([
        'car',
        'images',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phone',
        'user.businessName',
        'user.verified',
        'user.avatar',
        'user.email',
        'user.createdAt',
      ])
      .where('car.id = :id', { id })
      .getOne();

    if (!car) throw new Error('Car not found');
    return car;
  }

  static async incrementViews(id: string) {
    await carRepository().increment({ id }, 'views', 1);
  }

  static async update(id: string, userId: string, data: Partial<Car>) {
    const car = await carRepository().findOne({ where: { id, userId } });
    if (!car) throw new Error('Car not found or unauthorized');

    await carRepository().update(id, data);
    return this.findById(id);
  }

  static async delete(id: string, userId: string) {
    const car = await carRepository().findOne({ where: { id, userId } });
    if (!car) throw new Error('Car not found or unauthorized');
    await carRepository().delete(id);
    return { message: 'Car deleted successfully' };
  }

  static async addImages(carId: string, userId: string, imageUrls: string[]) {
    const car = await carRepository().findOne({ where: { id: carId, userId } });
    if (!car) throw new Error('Car not found or unauthorized');

    const existingCount = await imageRepository().count({ where: { carId } });
    const images = imageUrls.map((url, index) =>
      imageRepository().create({
        url,
        isPrimary: existingCount === 0 && index === 0,
        carId,
      })
    );
    await imageRepository().save(images);
    return this.findById(carId);
  }

  static async deleteImage(imageId: string, userId: string) {
    const image = await imageRepository()
      .createQueryBuilder('img')
      .leftJoin('img.car', 'car')
      .where('img.id = :imageId', { imageId })
      .andWhere('car.userId = :userId', { userId })
      .getOne();

    if (!image) throw new Error('Image not found or unauthorized');
    await imageRepository().delete(imageId);
    return { message: 'Image deleted successfully' };
  }

  static async toggleFavorite(userId: string, carId: string) {
    const existing = await favoriteRepository().findOne({ where: { userId, carId } });
    if (existing) {
      await favoriteRepository().delete(existing.id);
      return { favorited: false };
    }
    const fav = favoriteRepository().create({ userId, carId });
    await favoriteRepository().save(fav);
    return { favorited: true };
  }

  static async getFavorites(userId: string) {
    const favorites = await favoriteRepository().find({
      where: { userId },
      relations: ['car', 'car.images', 'car.user'],
    });
    return favorites.map((f) => f.car);
  }

  static async getSimilar(carId: string, limit: number = 4) {
    const car = await carRepository().findOne({ where: { id: carId } });
    if (!car) return [];

    return carRepository()
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.images', 'images')
      .where('car.id != :id', { id: carId })
      .andWhere('car.status = :status', { status: CarStatus.ACTIVE })
      .andWhere('(car.make = :make OR car.bodyType = :bodyType)', {
        make: car.make,
        bodyType: car.bodyType,
      })
      .orderBy('car.views', 'DESC')
      .take(limit)
      .getMany();
  }

  static async getDashboardStats(userId: string) {
    const totalListings = await carRepository().count({ where: { userId } });
    const activeListings = await carRepository().count({ where: { userId, status: CarStatus.ACTIVE } });
    const soldListings = await carRepository().count({ where: { userId, status: CarStatus.SOLD } });

    const viewsResult = await carRepository()
      .createQueryBuilder('car')
      .select('SUM(car.views)', 'totalViews')
      .where('car.userId = :userId', { userId })
      .getRawOne();

    return {
      totalListings,
      activeListings,
      soldListings,
      totalViews: parseInt(viewsResult?.totalViews || '0'),
    };
  }

  static async getMakes() {
    const result = await carRepository()
      .createQueryBuilder('car')
      .select('DISTINCT car.make', 'make')
      .where('car.status = :status', { status: CarStatus.ACTIVE })
      .orderBy('car.make', 'ASC')
      .getRawMany();
    return result.map((r: any) => r.make);
  }

  static async getModelsByMake(make: string) {
    const result = await carRepository()
      .createQueryBuilder('car')
      .select('DISTINCT car.model', 'model')
      .where('car.make = :make', { make })
      .andWhere('car.status = :status', { status: CarStatus.ACTIVE })
      .orderBy('car.model', 'ASC')
      .getRawMany();
    return result.map((r: any) => r.model);
  }
}
