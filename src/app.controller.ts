import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('local')) // This is name our selected strategy
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
