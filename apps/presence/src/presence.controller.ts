import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { PresenceService } from './presence.service';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async postUser(@Ctx() ctx: RmqContext) {
    this.sharedService.acknowledgeMessage(ctx);

    return this.presenceService.getHello();
  }
}
