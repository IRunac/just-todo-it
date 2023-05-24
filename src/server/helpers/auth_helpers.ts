import crypto from 'crypto';
import { PassportStatic } from 'passport';
import { User } from '../entities/User';

export const comparePassword = (user: User, password: string) => {
  const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256').toString('hex');
  return hashedPassword === user.password;
};

export const isAuthenticated = (passport: PassportStatic) => {
  return passport.authenticate(('jwt'), { session: false });
};
