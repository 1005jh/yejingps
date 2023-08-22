import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const WsUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToWs().getData();
  return req.user;
});
