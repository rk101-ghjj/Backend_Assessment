import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let auth: jest.Mocked<AuthService>;
  let users: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: { validateUser: jest.fn(), login: jest.fn() } },
        { provide: UsersService, useValue: { create: jest.fn() } },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    auth = moduleRef.get(AuthService) as any;
    users = moduleRef.get(UsersService) as any;
  });

  it('registers and returns token', async () => {
    users.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', role: 'user' } as any);
    auth.login.mockResolvedValue({ accessToken: 't' });
    const res = await controller.register({ email: 'a@b.com', password: 'secretsecret' } as any);
    expect(res.accessToken).toBe('t');
  });
});


