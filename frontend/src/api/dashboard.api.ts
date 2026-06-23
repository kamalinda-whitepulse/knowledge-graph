import api from './axios';
import type { DashboardResult } from '../types/dashboard.types';

export const dashboardApi = {

  getStats: () =>
    api.get<DashboardResult>('/dashboard'),

};
