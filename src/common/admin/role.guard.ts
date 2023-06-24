import { UserEntity } from 'src/entity/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles(RoleType.ADMIN, RoleType.USER) 데코레이터 에서 인자로 넘겨준 롤타입들을 배열로 가져옴
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    console.log('my role:', user.manage);

    // some() 메서드는 배열 안의 어떤 요소라도 주어진 판별 함수를 통과하는지 테스트합니다.
    return (
      user && user.manage && roles.includes(user.manage)
      //user.authorities.some((role) => roles.includes(role))
    );
  }
}
