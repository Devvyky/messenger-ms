import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  constructor() {}

  hasJWT() {
    return { jwt: 'token' };
  }
}
