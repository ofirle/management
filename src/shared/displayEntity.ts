import { User } from '../auth/auth.entity';

export const displayUserData = (user: User): User => {
  const userData = new User();
  userData.id = user.id;
  userData.username = user.username;
  userData.name = user.name;
  return userData;
};
