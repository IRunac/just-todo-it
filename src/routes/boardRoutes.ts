import express, { Request, Response } from 'express';
import { Board } from '../entities/Board';
import { EntityRepository } from '@mikro-orm/core';
import { getOrmInstance } from '../index';

interface BoardRepository extends EntityRepository<Board> {
  getKnex(): any;
}

async function getKnex() {
  const orm = await getOrmInstance();
  const boardRepository = orm.em.getRepository(Board) as BoardRepository;
  const knex = boardRepository.getKnex();
  return knex;
}

const router = express.Router();

// GET ALL
router.get('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const boards = await knex('boards').select('*');
  res.status(200).send(boards);
});

// GET BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const board = await knex('boards').select('*').where({ id }).first();
  if (!board) res.sendStatus(404).send('Board not found');
  res.status(200).send(board);
});

// POST
router.post('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const newBoard: Board = { ...req.body };
  await knex('boards').insert(newBoard);
  res.sendStatus(201);
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const deletedBoard = await knex('boards').where({ id }).delete();
  if (!deletedBoard) res.status(404).send('Board not found');
  res.sendStatus(204);
});

// PATCH
router.patch('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const { type } = req.body;
  const knex = await getKnex();
  const board = await knex('boards').select('*').where({ id }).first();
  if (!board) res.sendStatus(404);
  await knex('boards').where({ id }).update({
    type: type || board.type
  });
  res.sendStatus(200);
});

export default router;
