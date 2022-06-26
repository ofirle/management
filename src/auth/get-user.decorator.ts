import {
  createParamDecorator,
  ExecutionContext,
  MethodNotAllowedException,
} from '@nestjs/common';
import { User } from './auth.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!_data?.actions) return user;
    const actions = Array.isArray(_data.action)
      ? _data.actions
      : [_data.actions];
    if (!user?.role) {
      throw new MethodNotAllowedException(
        'you dont have the permission. no role has been assigned to you',
      );
    }
    const allowedActions = user.role.permissions.map(
      (permission) => permission.action,
    );

    if (!actions.every((v) => allowedActions.includes(v))) {
      throw new MethodNotAllowedException('you dont have the permission');
    }

    return user;
  },
);
