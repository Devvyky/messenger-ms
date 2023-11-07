import { Controller, UseGuards } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SharedService } from '@app/shared';
import { NewUserDTO } from './dtos/new-user.dto';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-users' })
  async getUser(@Ctx() ctx: RmqContext) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() ctx: RmqContext, @Payload() newUser: NewUserDTO) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.authService.register(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() ctx: RmqContext,
    @Payload() payload: { email: string; password: string },
  ) {
    const { email, password } = payload;
    this.sharedService.acknowledgeMessage(ctx);

    return this.authService.login(email, password);
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtGuard)
  async verifyJwt(@Ctx() ctx: RmqContext, @Payload() payload: { jwt: string }) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.authService.verifyJwt(payload.jwt);
  }
}
