/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { crypt_compare } from 'src/common/crypt.handler';
import { SanitizedUserDTO } from 'src/users/dto/sanitized-user.dto';
import { UsersService } from '../users/users.service';
import { LoginPayloadDTO } from './dtos/login-payload.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { LoginDTO } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDTO: LoginDTO): Promise<SanitizedUserDTO> {
    const user = await this.usersService.findByUsername(loginDTO.username);

    if (!user) {
      throw new UnauthorizedException('This username does not exist.');
    } else if (!(await crypt_compare(loginDTO.password, user.password))) {
      throw new UnauthorizedException('Wrong password.');
    }
    return user; // TODO sanitize it
  }

  login(user: any): LoginResponseDTO {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user._id,
      }),
    };
  }
}
