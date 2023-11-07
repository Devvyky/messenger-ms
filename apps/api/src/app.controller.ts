import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@app/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Get('auth')
  getUsers() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @UseGuards(AuthGuard)
  @Get('presence')
  getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }

  @Post('auth/login')
  async login(
    @Body()
    payload: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.send({ cmd: 'login' }, { ...payload });
  }

  @Post('auth/register')
  async register(
    @Body()
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    return this.authService.send({ cmd: 'register' }, { ...payload });
  }
}
