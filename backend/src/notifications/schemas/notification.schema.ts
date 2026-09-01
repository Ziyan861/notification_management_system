import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationCategory } from '../enums/notification-category.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true, trim: true })
  header: string;

  @Prop({ type: String, required: true, trim: true })
  body: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(NotificationCategory),
  })
  category: NotificationCategory;

  @Prop({ type: Boolean, required: true, default: false })
  isClosed: boolean;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  date: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);