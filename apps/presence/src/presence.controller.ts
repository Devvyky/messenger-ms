import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService, AuthGuard } from '@app/shared';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
    // TEMP
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async postUser(@Ctx() ctx: RmqContext) {
    this.sharedService.acknowledgeMessage(ctx);

    console.log(123, this.authGuard.hasJWT());

    return this.presenceService.getHello();
  }
}
