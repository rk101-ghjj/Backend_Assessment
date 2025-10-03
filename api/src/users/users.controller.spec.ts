import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(UsersController);
    service = moduleRef.get(UsersService) as any;
  });

  it('creates user via controller', async () => {
    service.create.mockResolvedValue({ id: '1' } as any);
    const res = await controller.create({ email: 'a@b.com', password: 'password123' } as any);
    expect(res.id).toBe('1');
  });
});


