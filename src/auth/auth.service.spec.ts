import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const usersService = new UsersService();
    const jwtService = new JwtService({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    });

    service = new AuthService(usersService, jwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
