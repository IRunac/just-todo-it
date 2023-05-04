import express, { Request, Response } from 'express';
import { EntityRepository } from '@mikro-orm/core';
import { getOrmInstance } from '../index';
import { TodoItem } from '../entities/TodoItem';

interface TodoItemRepository extends EntityRepository<TodoItem> {
  getKnex(): any;
}

async function getKnex() {
  const orm = await getOrmInstance();
  const todoItemRepository = orm.em.getRepository(TodoItem) as TodoItemRepository;
  const knex = todoItemRepository.getKnex();
  return knex;
}

const router = express.Router();

// GET ALL
router.get('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const todoItems = await knex('todo_items').select('*');
  res.status(200).send(todoItems);
});

// GET BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const todoItem = await knex('todo_items').select('*').where({ id }).first();
  if (!todoItem) res.sendStatus(404).send('Todo Item not found');
  res.status(200).send(todoItem);
});

// POST
router.post('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const newTodoItem: TodoItem = { ...req.body };
  await knex('todo_items').insert(newTodoItem);
  res.sendStatus(201);
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const deletedTodoItem = await knex('todo_items').where({ id }).delete();
  if (!deletedTodoItem) res.status(404).send('Todo Item not found');
  res.sendStatus(204);
});

// PATCH
router.patch('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const {
    name,
    status,
    completed_increment: completedIncrement,
    failed_increment: failedIncrement,
    user_id: userId,
    board_id: boardId
  } = req.body;
  const knex = await getKnex();
  const todoItem = await knex('todo_items').select('*').where({ id }).first();
  if (!todoItem) res.sendStatus(404);
  await knex('todo_items').where({ id }).update({
    name: name || todoItem.name,
    status: status || todoItem.status,
    completed_increment: completedIncrement || todoItem.completed_increment,
    failed_increment: failedIncrement || todoItem.failed_increment,
    board_id: boardId || todoItem.board_id,
    user_id: userId || todoItem.user_id
  });
  res.sendStatus(200);
});

export default router;
