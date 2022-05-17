import { User } from '../users/user.entity';

export const hideUserData = (user: User): User => {
  const user2 = new User();
  user2.id = user.id;
  user2.username = user.username;
  // user.sources = null;
  // user.email = null;
  // user.name = null;
  // user.transactions = null;
  // user.image = null;
  // user.rules = null;
  // user.password = null;
  return user2;
};
