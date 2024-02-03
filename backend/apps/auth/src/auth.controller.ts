import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@app/common';
import { User } from '@app/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() userData: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(userData, response);
    response.json({
      message: 'Logged in successfully!',
      data: { firstName: userData.firstName, image: userData.image },
    });
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  validateUser(@CurrentUser() user: any) {
    return user;
  }
}
