import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {

  constructor(private dashboardService: DashboardService) {}

  // GET /dashboard
  @Get()
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboard(req.user.userId);
  }

}
