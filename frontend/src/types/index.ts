export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  DEALER = 'dealer',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional for auth payloads
  phone?: string;
  role: UserRole;
  avatar?: string;
  businessName?: string;
  location?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends Partial<User> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

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

export interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  carId: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  bodyType: BodyType;
  condition: CarCondition;
  color?: string;
  engine?: string;
  vin?: string;
  description?: string;
  location?: string;
  city?: string;
  state?: string;
  status: CarStatus;
  views: number;
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  images: CarImage[];
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CLOSED = 'closed',
}

export interface Lead {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message?: string;
  status: LeadStatus;
  carId: string;
  car?: Car;
  sellerId: string;
  seller?: User;
  createdAt: string;
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalViews: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CarListResponse {
  cars: Car[];
  total: number;
  page: number;
  totalPages: number;
}
