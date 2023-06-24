import { ManageEnum } from './../enum/manage.enum';
import { UserEntity } from 'src/entity/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user as UserEntity;

    return user && user.manage === ManageEnum.ADMIN;
  }
}
