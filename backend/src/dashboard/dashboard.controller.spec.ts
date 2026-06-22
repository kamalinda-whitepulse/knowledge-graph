import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  const mockDashboardService = {
    getDashboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call dashboardService.getDashboard with userId', () => {
    const req = { user: { userId: '507f1f77bcf86cd799439011' } } as any;
    controller.getDashboard(req);
    expect(mockDashboardService.getDashboard).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
  });

});
