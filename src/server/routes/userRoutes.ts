import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { DependecyInjection } from '../index';
import { isAuthenticated } from '../helpers/auth_helpers';
import { User } from '../entities';

export const userRoutesInit = (DI: DependecyInjection) => {
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next: NextFunction, id: string) => {
    const userId: number = parseInt(id);
    const user = await userRepository.findOne(
      { id: userId },
      { populate: ['categories', 'todo_items.categories', 'boards'] }
    );
    if (!user) return res.status(404).send('User not found');
    req.context = {};
    req.context.user = user;
    next();
  });

  // GET USER FROM JWT TOKEN
  router.get('/me', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    if (req.cookies.jwtToken) {
      const token: string = req.cookies.jwtToken;
      if (!token) return res.status(404).send(null);
      jwt.verify(token, process.env.SECRET_KEY!, async (error, decoded) => {
        if (error) return res.status(404).send(null);
        if (decoded) {
          const { username } = decoded as JwtPayload;
          const user = await userRepository.findOne({ username }, { populate: ['todo_items', 'boards'] });
          return res.status(200).send(user);
        }
      });
    } else {
      return res.status(404).send(null);
    }
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    return res.status(200).send(users);
  });

  // GET BY ID
  router.get('/:id', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    return res.status(200).send(req.context.user);
  });

  // GET BOARDS FOR USER
  router.get('/:id/boards', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const user = req.context.user;
    if (!user) return res.status(404).send('User not found');
    const boards = user.boards;
    if (!boards) return res.status(404).send('Boards not found for this user');
    return res.status(200).send(user.boards);
  });

  // GET CATEGORIES FOR USER
  router.get('/:id/categories', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const user = req.context.user;
    if (!user) return res.status(404).send('User not found');
    userRepository.populate(user, ['categories']);
    const categories = user.categories;
    if (!categories) return res.status(404).send('Categories not found for this user');
    return res.status(200).send(user.categories);
  });

  // GET TODO ITEMS FOR USER
  router.get('/:id/todoItems', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const todoItems = req.context.user?.todo_items;
    if (!todoItems) return res.status(404).send('Todo Items not found for this user');
    return res.status(200).send(todoItems);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const { password: rawPassword, username, role } = req.body;
    const password = crypto.pbkdf2Sync(rawPassword, salt, 310000, 32, 'sha256').toString('hex');
    const userData = { username, password, role, salt };
    const newUser = await userRepository.create(userData as User);
    res.status(201).send(newUser);
  });

  // DELETE
  router.delete('/:id', isAuthenticated(DI.passport), async (req: Request, res: Response) => {
    const user = req.context.user;
    if (!user) return;
    user.categories.removeAll();
    await userRepository.removeAndFlush(user);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { username, role } = req.body;
    const user = req.context.user!;
    user.username = username || user.username;
    user.role = role || user.role;
    await entityManager.persistAndFlush(user);
    return res.sendStatus(200);
  });

  return router;
};
