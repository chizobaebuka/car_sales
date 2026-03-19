import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Car, CarStatus, CarCondition, TransmissionType, FuelType, BodyType } from '../models/Car';
import { CarImage } from '../models/CarImage';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const userRepo = AppDataSource.getRepository(User);
    const carRepo = AppDataSource.getRepository(Car);
    const imageRepo = AppDataSource.getRepository(CarImage);

    // Clear existing data
    await imageRepo.createQueryBuilder().delete().execute();
    await carRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const dealer = userRepo.create({
      firstName: 'Emeka',
      lastName: 'Williams',
      email: 'emeka@naijadrive.com',
      password: hashedPassword,
      phone: '08012345678',
      role: UserRole.DEALER,
      businessName: 'Lagos Central Motors',
      location: 'Lekki, Lagos',
      verified: true,
    });

    const seller = userRepo.create({
      firstName: 'Amara',
      lastName: 'Okafor',
      email: 'amara@naijadrive.com',
      password: hashedPassword,
      phone: '08098765432',
      role: UserRole.SELLER,
      location: 'Abuja',
      verified: true,
    });

    const buyer = userRepo.create({
      firstName: 'Tunde',
      lastName: 'Bakare',
      email: 'tunde@naijadrive.com',
      password: hashedPassword,
      phone: '07011223344',
      role: UserRole.BUYER,
      location: 'Port Harcourt',
    });

    const [savedDealer, savedSeller, savedBuyer] = await userRepo.save([dealer, seller, buyer]);

    // Create cars
    const carsData = [
      {
        make: 'Toyota',
        model: 'Camry XSE',
        year: 2022,
        price: 28500000,
        mileage: 12500,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SEDAN,
        condition: CarCondition.FOREIGN_USED,
        color: 'Wind Chill Pearl',
        engine: '2.5L 4-Cyl',
        vin: '4T1B11HK5P1****',
        description: 'Immaculate 2022 Toyota Camry XSE, fully loaded with premium options. This vehicle was imported last month and has only 12,500km on the odometer. Features include panoramic sunroof, red leather interior, 360-degree camera, JBL premium sound system, and adaptive cruise control. Car is in showroom condition, no single fault. Serious buyers only. Price is slightly negotiable.',
        location: 'Lekki Phase 1, Lagos, Nigeria',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 1240,
        featured: true,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/sedan.png',
      },
      {
        make: 'Mercedes-Benz',
        model: 'GLE 450',
        year: 2021,
        price: 62500000,
        mileage: 8500,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SUV,
        condition: CarCondition.FOREIGN_USED,
        color: 'Obsidian Black',
        engine: '3.0L V6 Turbo',
        description: 'Stunning 2021 Mercedes-Benz GLE 450 AMG Line. Premium Plus package with Burmester sound, panoramic roof, 360 camera, and AMG body styling. Nigerian customs cleared, full documentation available.',
        location: 'Maitama, Abuja',
        city: 'Abuja',
        state: 'FCT',
        status: CarStatus.ACTIVE,
        views: 856,
        featured: true,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/luxury.png',
      },
      {
        make: 'Honda',
        model: 'Accord Sport',
        year: 2020,
        price: 18200000,
        mileage: 45000,
        transmission: TransmissionType.CVT,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SEDAN,
        condition: CarCondition.FOREIGN_USED,
        color: 'Modern Steel Metallic',
        engine: '1.5L Turbo',
        description: 'Clean 2020 Honda Accord Sport. Well maintained, regular servicing at Honda authorized service center. Sport package includes larger wheels, sport suspension, and paddle shifters.',
        location: 'GRA, Port Harcourt',
        city: 'Port Harcourt',
        state: 'Rivers',
        status: CarStatus.ACTIVE,
        views: 3420,
        featured: true,
        verified: true,
        userId: savedSeller.id,
        imageUrl: '/images/hatchback.png',
      },
      {
        make: 'Toyota',
        model: 'Land Cruiser',
        year: 2023,
        price: 95000000,
        mileage: 5000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.DIESEL,
        bodyType: BodyType.SUV,
        condition: CarCondition.BRAND_NEW,
        color: 'Precious White Pearl',
        engine: '3.3L V6 Diesel Twin-Turbo',
        description: 'Brand new 2023 Toyota Land Cruiser 300 Series. VX trim with full option. Multi-terrain select, crawl control, 360-degree camera, JBL premium audio.',
        location: 'Victoria Island, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 2100,
        featured: true,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/suv.png',
      },
      {
        make: 'Toyota',
        model: 'Hilux',
        year: 2023,
        price: 42000000,
        mileage: 10000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.DIESEL,
        bodyType: BodyType.TRUCK,
        condition: CarCondition.FOREIGN_USED,
        color: 'Super White',
        engine: '2.8L D-4D Diesel',
        description: 'Toyota Hilux 2023 Adventure trim. 4x4 with diff lock, leather seats, touchscreen infotainment, and rear camera. Perfect for both city and off-road use.',
        location: 'Ikeja, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 1850,
        featured: false,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/truck.png',
      },
      {
        make: 'Lexus',
        model: 'RX 350',
        year: 2022,
        price: 45000000,
        mileage: 18000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SUV,
        condition: CarCondition.FOREIGN_USED,
        color: 'Eminent White Pearl',
        engine: '3.5L V6',
        description: 'Elegant 2022 Lexus RX 350 F-Sport. Mark Levinson audio, heads-up display, panoramic roof, adaptive variable suspension. Pristine condition.',
        location: 'Wuse, Abuja',
        city: 'Abuja',
        state: 'FCT',
        status: CarStatus.ACTIVE,
        views: 960,
        featured: true,
        verified: true,
        userId: savedSeller.id,
        imageUrl: '/images/suv.png',
      },
      {
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        price: 24500000,
        mileage: 24000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SEDAN,
        condition: CarCondition.FOREIGN_USED,
        color: 'Celestite Grey',
        engine: '2.0L Dynamic Force',
        description: '2022 Toyota Corolla SE. Toyota Safety Sense, Apple CarPlay, Android Auto, LED headlights. Very fuel efficient and reliable.',
        location: 'Lekki, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 2300,
        featured: false,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/sedan.png',
      },
      {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 22800000,
        mileage: 15500,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SEDAN,
        condition: CarCondition.FOREIGN_USED,
        color: 'Sonic Grey Pearl',
        engine: '1.5L Turbo',
        description: '2021 Honda Civic Touring. Full option, leather seats, Honda Sensing suite, wireless CarPlay. Impeccable condition.',
        location: 'Ibadan',
        city: 'Ibadan',
        state: 'Oyo',
        status: CarStatus.ACTIVE,
        views: 1500,
        featured: false,
        verified: false,
        userId: savedSeller.id,
        imageUrl: '/images/hatchback.png',
      },
      {
        make: 'Jeep',
        model: 'Wrangler',
        year: 2021,
        price: 55000000,
        mileage: 10000,
        transmission: TransmissionType.MANUAL,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SUV,
        condition: CarCondition.FOREIGN_USED,
        color: 'Sarge Green',
        engine: '3.6L V6 Pentastar',
        description: '2021 Jeep Wrangler Rubicon. True off-road beast with locking diffs, disconnecting sway bar, and rock rails. Removable top and doors for ultimate fun.',
        location: 'Ikeja, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 780,
        featured: false,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/suv.png',
      },
      {
        make: 'Mercedes-Benz',
        model: 'C300',
        year: 2018,
        price: 34200000,
        mileage: 42000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SEDAN,
        condition: CarCondition.FOREIGN_USED,
        color: 'Selenite Grey',
        engine: '2.0L Turbo',
        description: '2018 Mercedes C300 4MATIC. AMG package, Burmester sound, panoramic roof. Very clean with full service history.',
        location: 'Port Harcourt',
        city: 'Port Harcourt',
        state: 'Rivers',
        status: CarStatus.ACTIVE,
        views: 620,
        featured: false,
        verified: true,
        userId: savedSeller.id,
        imageUrl: '/images/luxury.png',
      },
      {
        make: 'Kia',
        model: 'Sportage',
        year: 2023,
        price: 38900000,
        mileage: 5000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.PETROL,
        bodyType: BodyType.SUV,
        condition: CarCondition.FOREIGN_USED,
        color: 'Snow White Pearl',
        engine: '2.5L GDI',
        description: '2023 Kia Sportage SX Prestige. Dual panoramic display, Harman Kardon audio, highway driving assist, remote parking. Futuristic design.',
        location: 'Lekki, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 540,
        featured: false,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/suv.png',
      },
      {
        make: 'Toyota',
        model: 'Prado',
        year: 2022,
        price: 45000000,
        mileage: 12000,
        transmission: TransmissionType.AUTOMATIC,
        fuelType: FuelType.DIESEL,
        bodyType: BodyType.SUV,
        condition: CarCondition.FOREIGN_USED,
        color: 'Attitude Black',
        engine: '2.8L D-4D Diesel',
        description: '2022 Toyota Land Cruiser Prado TX-L Package. Full option with Kdss, crawl control, multi terrain monitor. Very rugged and reliable.',
        location: 'Ikeja, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        status: CarStatus.ACTIVE,
        views: 1240,
        featured: true,
        verified: true,
        userId: savedDealer.id,
        imageUrl: '/images/suv.png',
      },
    ];

    for (const carData of carsData) {
      const { imageUrl, ...rest } = carData;
      const car = carRepo.create(rest);
      const savedCar = await carRepo.save(car);

      const image = imageRepo.create({
        url: imageUrl,
        isPrimary: true,
        carId: savedCar.id,
      });
      await imageRepo.save(image);
    }

    console.log('✅ Seed data created successfully!');
    console.log(`   - ${3} users created`);
    console.log(`   - ${carsData.length} cars created`);
    console.log('\n📧 Login credentials:');
    console.log('   Dealer: emeka@naijadrive.com / password123');
    console.log('   Seller: amara@naijadrive.com / password123');
    console.log('   Buyer:  tunde@naijadrive.com / password123');

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
