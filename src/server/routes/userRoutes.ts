import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { DependecyInjection } from '../index';
import { isAuthenticated } from '../helpers/auth_helpers';

export const userRoutesInit = (DI: DependecyInjection) => {
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
    const userId: number = parseInt(id);
    const user = await userRepository.findOne(
      { id: userId },
      { populate: ['todo_items.categories', 'boards'] }
    );
    if (!user) return res.status(404).send('User not found');
    req.user = user;
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
    return res.status(200).send(req.user);
  });

  // GET BOARDS FOR USER
  router.get('/:id/boards', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(404).send('User not found');
    const boards = user.boards;
    if (!boards) return res.status(404).send('Boards not found for this user');
    return res.status(200).send(user.boards);
  });

  // GET CATEGORIES FOR USER
  router.get('/:id/categories', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(404).send('User not found');
    userRepository.populate(user, ['categories']);
    const categories = user.categories;
    if (!categories) return res.status(404).send('Categories not found for this user');
    return res.status(200).send(user.categories);
  });

  // GET TODO ITEMS FOR USER
  router.get('/:id/todoItems', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const todoItems = req.user?.todo_items;
    if (!todoItems) return res.status(404).send('Todo Items not found for this user');
    return res.status(200).send(todoItems);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const userData = { ...req.body, salt };
    const newUser = await userRepository.create(userData);
    res.status(201).send(newUser);
  });

  // DELETE
  router.delete('/:id', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    await entityManager.removeAndFlush(req.user!);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { username, role } = req.body;
    const user = req.user!;
    user.username = username || user.username;
    user.role = role || user.role;
    await entityManager.persistAndFlush(user);
    return res.sendStatus(200);
  });

  return router;
};
