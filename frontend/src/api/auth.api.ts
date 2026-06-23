import api from './axios';
import type { AuthResponse, RegisterResponse } from '../types/auth.types';

export const authApi = {

  register: (email: string, password: string) =>
    api.post<RegisterResponse>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

};
