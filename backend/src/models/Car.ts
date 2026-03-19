import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { CarImage } from './CarImage';
import { Favorite } from './Favorite';
import { Lead } from './Lead';

export enum CarStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SOLD = 'sold',
  DRAFT = 'draft',
}

export enum CarCondition {
  FOREIGN_USED = 'foreign_used',
  NIGERIAN_USED = 'nigerian_used',
  BRAND_NEW = 'brand_new',
}

export enum TransmissionType {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  CVT = 'cvt',
}

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
}

export enum BodyType {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  COUPE = 'coupe',
  TRUCK = 'truck',
  VAN = 'van',
  WAGON = 'wagon',
  CONVERTIBLE = 'convertible',
  LUXURY = 'luxury',
}

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ nullable: true })
  mileage: number;

  @Column({ type: 'enum', enum: TransmissionType, default: TransmissionType.AUTOMATIC })
  transmission: TransmissionType;

  @Column({ type: 'enum', enum: FuelType, default: FuelType.PETROL })
  fuelType: FuelType;

  @Column({ type: 'enum', enum: BodyType, default: BodyType.SEDAN })
  bodyType: BodyType;

  @Column({ type: 'enum', enum: CarCondition, default: CarCondition.FOREIGN_USED })
  condition: CarCondition;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  engine: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ type: 'enum', enum: CarStatus, default: CarStatus.PENDING })
  status: CarStatus;

  @Column({ default: 0 })
  views: number;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.cars, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CarImage, (img) => img.car, { cascade: true, eager: true })
  images: CarImage[];

  @OneToMany(() => Favorite, (fav) => fav.car)
  favorites: Favorite[];

  @OneToMany(() => Lead, (lead) => lead.car)
  leads: Lead[];
}
