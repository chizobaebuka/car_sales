import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DATABASE_URL ? undefined : (process.env.DB_USERNAME || 'postgres'),
  password: process.env.DATABASE_URL ? undefined : (process.env.DB_PASSWORD || '1234'),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'naijadrive'),
  synchronize: true,
  logging: false,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  entities: [__dirname + '/../models/*.{js,ts}'],
  subscribers: [],
  migrations: [],
});
