import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationCategory } from '../enums/notification-category.enum';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  header: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsEnum(NotificationCategory)
  category: NotificationCategory;
}