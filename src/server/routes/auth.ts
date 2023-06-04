import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { comparePassword } from '../helpers/auth_helpers';
import crypto from 'crypto';
import { DependecyInjection } from '../index';
import express from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User';

export const authRoutesInit = (DI: DependecyInjection) => {
  const router = express.Router();

  const secretKey = process.env.SECRET_KEY as jwt.Secret;
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey
  } as StrategyOptions;

  DI.passport.use(new JwtStrategy(jwtOptions, async ({ username }, done) => {
    try {
      const user = await DI.userRepository.findOne({ username });
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  }));

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const payload = { username };
    const user = await DI.userRepository.findOne({ username });
    if (!user) return res.sendStatus(401);
    const isMatch = comparePassword(user, password);
    if (isMatch) {
      const token = jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret);
      return res.cookie('jwtToken', token).status(200).json({ user }).send();
    }
    return res.sendStatus(401);
  });

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const payload = { username };
    const user = await DI.userRepository.findOne({ username });
    if (user) return res.sendStatus(409);
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
    const newUser = {
      username,
      salt,
      password: hashedPassword,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await DI.userRepository.create(newUser);
    const token = jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret);
    return res.cookie('jwtToken', token).status(200).json({ user: newUser }).send();
  });

  return router;
};
