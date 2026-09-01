import { api } from './api';
import type {
  CreateNotificationInput,
  UpdateNotificationInput,
  UserNotification,
} from '../models/notification';

export const notificationService = {
  async getAll(): Promise<UserNotification[]> {
    const { data } = await api.get<UserNotification[]>('/notifications');
    return data;
  },

  async getById(id: string): Promise<UserNotification> {
    const { data } = await api.get<UserNotification>(`/notifications/${id}`);
    return data;
  },

  async create(input: CreateNotificationInput): Promise<UserNotification> {
    const { data } = await api.post<UserNotification>('/notifications', input);
    return data;
  },

  async update(
    id: string,
    input: UpdateNotificationInput,
  ): Promise<UserNotification> {
    const { data } = await api.put<UserNotification>(
      `/notifications/${id}`,
      input,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },
};