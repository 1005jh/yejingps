import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';

interface Payload {
  username?: string;
  id: number;
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const cookies: string[] = client.handshake.headers.cookie.split('; ');
    const authToken = cookies
      .find((cookie) => cookie.startsWith('jwt'))
      .split('=')[1];
    const jwtPayload: Payload = <Payload>(
      jwt.verify(authToken, process.env.SECRETKEY)
    );
    const user = await this.authService.validateUser(jwtPayload);
    context.switchToWs().getData().user = user;
    console.log(
      context.switchToWs().getClient(),
      'ddddddddddddddddddddddddddddddddd',
    );
    return Boolean(user);
  }
}
