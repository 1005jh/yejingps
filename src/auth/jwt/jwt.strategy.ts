import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './../auth.service';
import { Injectable, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

interface Payload {
  username?: string;
  nickname?: string;
  id: number;
}

const fromAuthCookie = function () {
  return function (request) {
    let token = null;
    if (request && request.cookies) {
      token = request.cookies['jwt'];
      if (!token) {
        const { authorization } = request.headers;
        if (!authorization) return token;
        token = authorization.replace('Bearer ', '');
      }
    }
    return token;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: fromAuthCookie(),
      secretOrKey: process.env.SECRETKEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.authService.validateUser(payload);
    console.log(user, payload);
    if (!user) {
      throw new HttpException('접근 오류', 400);
    }
    return user;
  }
}
