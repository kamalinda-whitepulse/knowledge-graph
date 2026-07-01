import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import type { AuthenticatedRequest } from '../common/authenticated-request.interface';

@UseGuards(JwtAuthGuard)
@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')

@Controller('dashboard')
export class DashboardController {

  constructor(private dashboardService: DashboardService) {}

  // GET /dashboard
  @Get()
  @ApiOperation({ summary: 'Get dashboard stats' })
  @ApiResponse({ status: 200, description: 'Returns total notes, connections, most connected and recent notes' })
  getDashboard(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getDashboard(req.user.userId);
  }

}
