// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AuthGuard extends NestAuthGuard('jwt') {
//   canActivate(context: ExecutionContext): any {
//     return super.canActivate(context);
//   }
// }
// jwt.guard.ts

import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import * as cookie from 'cookie'; // cookie-parser 패키지를 사용
import * as jwt from 'jsonwebtoken'; // jwt를 import합니다.
import { AuthService } from '../auth.service'; // AuthService를 import합니다.
import { Socket } from 'socket.io';

interface Payload {
  username?: string;
  id: number;
}

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      secretOrKey: process.env.SECRETKEY,
      ignoreExpiration: false,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isWsContext = context.getType() === 'ws';

    if (isWsContext) {
      const client: Socket = context.switchToWs().getClient();
      const cookies = client.handshake.headers.cookie;
      const parsedCookies = cookie.parse(cookies || '');
      const token = parsedCookies.jwt;
      const result = await this.validateToken(token);
      console.log(result, 'result ');
      // 토큰을 검사하는 로직
      if (!result) {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } else {
      await super.canActivate(context);
      return true;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      console.log(token, '토큰확인');

      const decoded: Payload = jwt.verify(
        token,
        process.env.SECRETKEY,
      ) as Payload;
      console.log(decoded, '토큰해부');
      const payload: Payload = {
        id: decoded.id,
        username: decoded.username,
      };
      console.log(payload, '페이로드');
      const user = await this.authService.validateUser(payload);
      console.log(user, '유저정보확인');

      if (!user) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
