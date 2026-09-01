import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationCategory } from '../enums/notification-category.enum';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  header?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  body?: string;

  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}