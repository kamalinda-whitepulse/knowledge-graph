import { create } from 'zustand';
import type { User } from '../types/auth.types';

type AuthState = {
  token: string | null;
  user:  User | null;
  setToken: (token: string) => void;
  setUser:  (user: User)   => void;
  // note: logout only clears state - caller must navigate to /login
  logout:   ()             => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user:  null,

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  setUser: (user) => set({ user }),

  // clears store and localStorage - caller is responsible for navigating to /login
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
