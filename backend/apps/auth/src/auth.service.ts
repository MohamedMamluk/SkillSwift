import { Injectable } from '@nestjs/common';
import { User } from './users/models/user.schema';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async login(userData: User, response: Response) {
    const token = this.jwtService.sign({
      _id: userData._id.toHexString(),
    });

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRES'),
    );

    response.cookie('access_token', token, {
      httpOnly: true,
      expires,
    });
  }
  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
