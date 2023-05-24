import express, { NextFunction, Request, Response } from 'express';
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
      { populate: ['todo_items'] }
    );
    if (!user) return res.status(404).send('User not found');
    req.body.user = user;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    res.status(200).send(users);
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
