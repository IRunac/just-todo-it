import express, { Request, Response } from 'express';
import { EntityRepository } from '@mikro-orm/core';
import { getOrmInstance } from '../index';
import { User } from '../entities/User';

interface UserRepository extends EntityRepository<User> {
  getKnex(): any;
}

async function getKnex() {
  const orm = await getOrmInstance();
  const userRepository = orm.em.getRepository(User) as UserRepository;
  const knex = userRepository.getKnex();
  return knex;
}

const router = express.Router();

// GET ALL
router.get('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const users = await knex('users').select('*');
  res.status(200).send(users);
});

// GET BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const user = await knex('users').select('*').where({ id }).first();
  if (!user) res.sendStatus(404).send('User not found');
  res.status(200).send(user);
});

// POST
router.post('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const newUser: User = { ...req.body };
  await knex('users').insert(newUser);
  res.sendStatus(201);
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const deletedUser = await knex('users').where({ id }).delete();
  if (!deletedUser) res.status(404).send('User not found');
  res.sendStatus(204);
});

// PATCH
router.patch('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const { username, role } = req.body;
  const knex = await getKnex();
  const user = await knex('users').select('*').where({ id }).first();
  if (!user) res.sendStatus(404);
  await knex('users').where({ id }).update({
    username: username || user.username,
    role: role || user.role
  });
  res.sendStatus(200);
});

export default router;
