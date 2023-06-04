import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DependecyInjection } from '../index';
import { isAuthenticated } from '../helpers/auth_helpers';

export const userRoutesInit = (DI: DependecyInjection) => {
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  // interface UserRequest extends Request {
  //   user?: User;
  // }

  router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
    const userId: number = parseInt(id);
    const user = await userRepository.findOne(
      { id: userId },
      { populate: ['todo_items', 'boards'] }
    );
    if (!user) return res.status(404).send('User not found');
    req.body.user = user;
    next();
  });

  // GET USER FROM JWT TOKEN
  router.get('/me', async (req: Request, res: Response) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) return res.status(401).send('Invalid token');
      jwt.verify(token, process.env.SECRET_KEY!, async (error, decoded) => {
        if (error) return res.status(401).send('Invalid token');
        if (decoded) {
          const { username } = decoded as JwtPayload;
          const user = await userRepository.findOne({ username }, { populate: ['todo_items', 'boards'] });
          return res.status(200).send(user);
        }
      });
    } else {
      return res.status(401).send('Authorization header not found');
    }
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    return res.status(200).send(users);
  });

  // GET BY ID
  router.get('/:id', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    return res.status(200).send(req.body.user);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const newUser = { ...req.body };
    await userRepository.create(newUser);
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    await entityManager.removeAndFlush(req.body.user!);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { username, role } = req.body;
    const user = req.body.user!;
    user.username = username || user.username;
    user.role = role || user.role;
    await entityManager.persistAndFlush(user);
    return res.sendStatus(200);
  });

  return router;
};
