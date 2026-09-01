import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';
import { NotificationCategory } from './enums/notification-category.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockModel = {
    create: jest.fn(),
  };

  const userId = '507f1f77bcf86cd799439011';

  const dto: CreateNotificationDto = {
    header: 'Server down',
    body: 'Production API is not responding',
    category: NotificationCategory.ERROR,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('persists the notification with the fields from the dto', async () => {
      mockModel.create.mockResolvedValue({ _id: 'generated-id', ...dto });

      await service.create(userId, dto);

      expect(mockModel.create).toHaveBeenCalledTimes(1);

      const saved = mockModel.create.mock.calls[0][0];
      expect(saved.header).toBe(dto.header);
      expect(saved.body).toBe(dto.body);
      expect(saved.category).toBe(NotificationCategory.ERROR);
    });

    it('sets userId from the authenticated user, not the request body', async () => {
      mockModel.create.mockResolvedValue({});

      await service.create(userId, dto);

      const saved = mockModel.create.mock.calls[0][0];
      expect(saved.userId).toEqual(new Types.ObjectId(userId));
    });

    it('always creates the notification as not closed', async () => {
      mockModel.create.mockResolvedValue({});

      await service.create(userId, dto);

      expect(mockModel.create.mock.calls[0][0].isClosed).toBe(false);
    });

    it('stamps the date on the server', async () => {
      mockModel.create.mockResolvedValue({});
      const before = Date.now();

      await service.create(userId, dto);

      const saved = mockModel.create.mock.calls[0][0];
      expect(typeof saved.date).toBe('number');
      expect(saved.date).toBeGreaterThanOrEqual(before);
      expect(saved.date).toBeLessThanOrEqual(Date.now());
    });

    it('returns whatever the model returns', async () => {
      const created = { _id: 'generated-id', ...dto };
      mockModel.create.mockResolvedValue(created);

      await expect(service.create(userId, dto)).resolves.toBe(created);
    });
  });
});
