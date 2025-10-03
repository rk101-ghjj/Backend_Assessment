import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let users: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: { findOneByEmail: jest.fn() } },
        { provide: JwtService, useValue: { signAsync: jest.fn(async () => 'token') } },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    users = moduleRef.get(UsersService) as any;
  });

  it('validates and logs in users', async () => {
    const user: any = { id: '1', email: 'a@b.com', passwordHash: await bcrypt.hash('secret', 10), role: 'user' };
    users.findOneByEmail.mockResolvedValue(user);
    const validated = await service.validateUser('a@b.com', 'secret');
    expect(validated.id).toBe('1');
    const login = await service.login(validated);
    expect(login.accessToken).toBe('token');
  });
});


