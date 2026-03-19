import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userRepository = () => AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    businessName?: string;
    location?: string;
  }) {
    const existing = await userRepository().findOne({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = userRepository().create({
      ...data,
      password: hashedPassword,
      role: data.role || UserRole.BUYER,
      verified: false,
      verificationOtp: otp,
    });

    await userRepository().save(user);

    // Mock Email Sending
    console.log(`-----------------------------------------`);
    console.log(`CONFIRMATION EMAIL SENT TO: ${user.email}`);
    console.log(`OTP FOR VERIFICATION: ${otp}`);
    console.log(`-----------------------------------------`);

    return { message: 'Registration successful. please check your email for OTP verification.' };
  }

  static async verifyOtp(email: string, otp: string) {
    const user = await userRepository().findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    if (user.verified) throw new Error('Account already verified');
    if (user.verificationOtp !== otp) throw new Error('Invalid OTP');

    user.verified = true;
    user.verificationOtp = undefined as any; // Clear OTP
    await userRepository().save(user);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async login(email: string, password: string) {
    const user = await userRepository().findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.verified) {
      throw new Error('Please verify your account first. check your email for OTP.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getProfile(userId: string) {
    const user = await userRepository().findOne({
      where: { id: userId },
      relations: ['cars'],
    });
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateProfile(userId: string, data: Partial<User>) {
    await userRepository().update(userId, data);
    return this.getProfile(userId);
  }
}
