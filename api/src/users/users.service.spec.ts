import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    repo = moduleRef.get(getRepositoryToken(User));
  });

  it('creates user with hashed password', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(null as any);
    jest.spyOn(repo, 'create').mockImplementation((x: any) => x);
    const saved: any = { id: 'u1', email: 'a@b.com', passwordHash: 'h' };
    jest.spyOn(repo, 'save').mockResolvedValueOnce(saved);
    const user = await service.create({ email: 'a@b.com', password: 'password123' });
    expect(user).toEqual(saved);
    expect(typeof user.passwordHash).toBe('string');
    expect(user.passwordHash).not.toBe('password123');
  });

  it('finds and updates user', async () => {
    const base: any = { id: 'u1', email: 'a@b.com', passwordHash: 'x', role: 'user' };
    jest.spyOn(service, 'findOneById').mockResolvedValue(base);
    jest.spyOn(repo, 'save').mockImplementation(async (x: any) => x);
    const updated = await service.update('u1', { role: 'admin' });
    expect(updated.role).toBe('admin');
  });
});


