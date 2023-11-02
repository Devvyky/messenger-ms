import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

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

  @Post('auth')
  postUser() {
    return this.authService.send({ cmd: 'post-user' }, {});
  }

  @Get('presence')
  getPresence() {
    return this.presenceService.send({ cmd: 'get-presence' }, {});
  }
}
