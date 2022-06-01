import {
  createParamDecorator,
  ExecutionContext,
  MethodNotAllowedException,
} from '@nestjs/common';
import { User } from '../users/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    console.log(_data);
    console.log(user.role);
    if (!_data.actions) return user;
    const actions = _data.actions;
    if (!user.role) {
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
