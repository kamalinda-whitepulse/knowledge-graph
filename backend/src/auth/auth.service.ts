import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // -----REGISTER----------------------------------------------------------------
  async register(email: string, password: string) {

    // Check if email already exists
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    // Hash the password — never save plain text
    const passwordHash = await bcrypt.hash(password, 10);

    // Save new user to MongoDB
    const user = await this.userModel.create({ email, passwordHash });

    return { message: 'Registration successful', userId: user._id };
  }

  // -----LOGIN----------------------------------------------------------------
  async login(email: string, password: string) {

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

}
