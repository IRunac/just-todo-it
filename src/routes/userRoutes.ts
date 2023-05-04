import express, { Request, Response } from 'express';

export const userRoutesInit = (DI: any) => {
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next, id) => {
    const userId: number = parseInt(id);
    const user = await userRepository.findOne({ id: userId });
    if (!user) return res.status(404).send('User not found');
    req.body = user;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.findAll();
    res.status(200).send(users);
  });

  // GET BY ID
  router.get('/:id', async (req: Request, res: Response) => {
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
    await entityManager.removeAndFlush(req.body.user);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { user, username, role } = req.body;
    user.username = username || user.username;
    user.role = role || user.role;
    await entityManager.persistAndFlush(user);
    return res.sendStatus(200);
  });

  return router;
};
