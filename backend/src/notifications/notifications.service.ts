import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    userId: string,
    dto: CreateNotificationDto,
  ): Promise<NotificationDocument> {
    return this.notificationModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      isClosed: false,
      date: Date.now(),
    });
  }

  async findAllForUser(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .exec();
  }

  async findOneForUser(
    userId: string,
    id: string,
  ): Promise<NotificationDocument> {
    const notification = Types.ObjectId.isValid(id)
      ? await this.notificationModel.findOne({
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        })
      : null;

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateNotificationDto,
  ): Promise<NotificationDocument> {
    const notification = Types.ObjectId.isValid(id)
      ? await this.notificationModel.findOneAndUpdate(
          {
            _id: new Types.ObjectId(id),
            userId: new Types.ObjectId(userId),
          },
          { $set: dto },
          { new: true, runValidators: true },
        )
      : null;

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = Types.ObjectId.isValid(id)
      ? await this.notificationModel.findOneAndDelete({
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        })
      : null;

    if (!deleted) {
      throw new NotFoundException('Notification not found');
    }
  }
}
