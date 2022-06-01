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
    if (!user.role) {
      throw new MethodNotAllowedException('you dont have the permission');
    }
    const allowedActions = user.role.permissions.map(
      (permission) => permission.action,
    );
    console.log(allowedActions);
    console.log(_data.actions);
    if (!allowedActions.includes(_data.actions)) {
      throw new MethodNotAllowedException('you dont have the permission');
    }
    console.log(_data);
    console.log(user);
    return user;
  },
);
