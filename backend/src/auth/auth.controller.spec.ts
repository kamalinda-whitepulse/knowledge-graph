import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login:    jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.register with email and password', async () => {
    mockAuthService.register.mockResolvedValue({ message: 'Registration successful', userId: 'id-1' });
    const result = await controller.register({ email: 'a@a.com', password: 'pass' });
    expect(mockAuthService.register).toHaveBeenCalledWith('a@a.com', 'pass');
    expect(result).toEqual({ message: 'Registration successful', userId: 'id-1' });
  });

  it('should call authService.login with email and password', async () => {
    mockAuthService.login.mockResolvedValue({ access_token: 'token' });
    const result = await controller.login({ email: 'a@a.com', password: 'pass' });
    expect(mockAuthService.login).toHaveBeenCalledWith('a@a.com', 'pass');
    expect(result).toEqual({ access_token: 'token' });
  });
});
