import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from './Favorite';
import { Lead } from './Lead';
import { Car } from './Car';

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  DEALER = 'dealer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verificationOtp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];

  @OneToMany(() => Lead, (lead) => lead.seller)
  leads: Lead[];
}
