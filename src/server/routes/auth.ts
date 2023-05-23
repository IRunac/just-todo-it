import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import crypto from 'crypto';
import { DependecyInjection } from '../index';
import express from 'express';
import jwt from 'jsonwebtoken';

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

    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256').toString('hex');
    const isMatch = hashedPassword === user.password;
    if (isMatch) {
      const token = jwt.sign(payload, process.env.SECRET_KEY as jwt.Secret);
      return res.status(200).json({ token }).send();
    }
    return res.sendStatus(401);
  });

  return router;
};
