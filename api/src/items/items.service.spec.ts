import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemsService } from './items.service';
import { Item } from './item.entity';

describe('ItemsService', () => {
  let service: ItemsService;
  let repo: Repository<Item>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ItemsService);
    repo = moduleRef.get(getRepositoryToken(Item));
  });

  it('creates and fetches items for user', async () => {
    jest.spyOn(repo, 'create').mockImplementation((x: any) => x);
    jest.spyOn(repo, 'save').mockImplementation(async (x: any) => ({ id: 'i1', ...x }));
    const created = await service.create('u1', { name: 'ItemA' });
    expect(created.id).toBe('i1');
    jest.spyOn(repo, 'find').mockResolvedValue([{ id: 'i1', name: 'ItemA' }] as any);
    const list = await service.findAllForUser('u1');
    expect(list.length).toBe(1);
  });
});


