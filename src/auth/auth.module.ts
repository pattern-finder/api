import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
