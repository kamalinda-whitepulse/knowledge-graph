import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create:  jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: JwtService,               useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@test.com' });
      await expect(service.register('test@test.com', 'password'))
        .rejects.toThrow(BadRequestException);
    });

    it('should create a user and return success message', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({ _id: 'user-id-1' });

      const result = await service.register('new@test.com', 'password');
      expect(result).toEqual({ message: 'Registration successful', userId: 'user-id-1' });
      expect(mockUserModel.create).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      await expect(service.login('missing@test.com', 'password'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUserModel.findOne.mockResolvedValue({
        email: 'test@test.com',
        passwordHash: await bcrypt.hash('correct-password', 10),
      });
      await expect(service.login('test@test.com', 'wrong-password'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('password', 10);
      mockUserModel.findOne.mockResolvedValue({
        _id: 'user-id-1',
        email: 'test@test.com',
        passwordHash,
      });

      const result = await service.login('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'mock-token' });
      expect(mockJwtService.sign).toHaveBeenCalled();
    });
  });
});
