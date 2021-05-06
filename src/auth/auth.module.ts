import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
