import { api } from './api';
import type { LoginResponse, User } from '../models/user';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/users/login', {
      username,
      password,
    });
    return data;
  },

  async register(
    fullName: string,
    username: string,
    password: string,
  ): Promise<User> {
    const { data } = await api.post<User>('/users/register', {
      fullName,
      username,
      password,
    });
    return data;
  },
};