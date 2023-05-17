import express, { Request, Response } from 'express';
import { DependecyInjection } from '../index';
import { User } from '../entities/User';

export const userRoutesInit = (DI: DependecyInjection) => {
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  interface UserRequest extends Request {
    user?: User
  }

  router.param('id', async (req: UserRequest, res: Response, next, id) => {
    const userId: number = parseInt(id);
    const user = await userRepository.findOne(
      { id: userId },
      { populate: ['todo_items'] }
    );
    if (!user) return res.status(404).send('User not found');
    req.user = user;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    res.status(200).send(users);
  });

  // GET BY ID
  router.get('/:id', async (req: UserRequest, res: Response) => {
    return res.status(200).send(req.user);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const newUser = { ...req.body };
    await userRepository.create(newUser);
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: UserRequest, res: Response) => {
    await entityManager.removeAndFlush(req.user!);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: UserRequest, res: Response) => {
    const { username, role } = req.body;
    const user = req.user!;
    user.username = username || user.username;
    user.role = role || user.role;
    await entityManager.persistAndFlush(user);
    return res.sendStatus(200);
  });

  return router;
};
