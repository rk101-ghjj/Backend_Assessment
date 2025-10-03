import { Test } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: jest.Mocked<ItemsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            create: jest.fn(),
            findAllForUser: jest.fn(),
            findOneForUser: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(ItemsController);
    service = moduleRef.get(ItemsService) as any;
  });

  it('creates item for JWT user', async () => {
    service.create.mockResolvedValue({ id: 'i1' } as any);
    const res = await controller.create({ user: { userId: 'u1' } } as any, { name: 'X' } as any);
    expect(res.id).toBe('i1');
  });
});


