import express, { Request, Response } from 'express';
import { Category } from '../entities/Category';
import { EntityRepository } from '@mikro-orm/core';
import { getOrmInstance } from '../index';

interface CategoryRepository extends EntityRepository<Category> {
  getKnex(): any;
}

async function getKnex() {
  const orm = await getOrmInstance();
  const categoryRepository = orm.em.getRepository(Category) as CategoryRepository;
  const knex = categoryRepository.getKnex();
  return knex;
}

export const router = express.Router();

// GET ALL
router.get('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const categories = await knex('categories').select('*');
  res.status(200).send(categories);
});

// GET BY ID
router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const category = await knex('categories').select('*').where({ id }).first();
  if (!category) res.sendStatus(404).send('Category not found');
  res.status(200).send(category);
});

// POST
router.post('/', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const newCategory: Category = { ...req.body };
  await knex('categories').insert(newCategory);
  res.sendStatus(201);
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const deletedCategory = await knex('categories').where({ id }).delete();
  if (!deletedCategory) res.status(404).send('Category not found');
  res.sendStatus(204);
});

// PATCH
router.patch('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const { name, color, value, max_value: maxValue, user_id: userId } = req.body;
  const knex = await getKnex();
  const category = await knex('categories').select('*').where({ id }).first();
  if (!category) res.sendStatus(404);
  await knex('categories').where({ id }).update({
    name: name || category.name,
    color: color || category.color,
    value: value || category.value,
    max_value: maxValue || category.max_value,
    user_id: userId || category.user_id
  });
  res.sendStatus(200);
});

// categories_todo_items routes

// GET BY ID
router.get('/:id/todoItems', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id!);
  const knex = await getKnex();
  const categories = await knex('categories_todo_items')
    .select('*')
    .where({ category_id: id });
  res.status(200).send(categories);
});

// POST
router.post('/:id/todoItems', async (req: Request, res: Response) => {
  const knex = await getKnex();
  const categoryId: number = parseInt(req.params.id!);
  const { todo_item_id: todoItemId } = req.body;
  console.log(categoryId, todoItemId);
  await knex('categories_todo_items').insert({ category_id: categoryId, todo_item_id: todoItemId });
  res.sendStatus(201);
});

// DELETE
router.delete('/:id/todoItems/:itemId', async (req: Request, res: Response) => {
  const categoryId: number = parseInt(req.params.id!);
  const todoItemId: number = parseInt(req.params.itemId!);
  const knex = await getKnex();
  const deletedCategory = await knex('categories_todo_items').where({
    category_id: categoryId, todo_item_id: todoItemId
  }).delete();
  if (!deletedCategory) res.status(404).send('Category - TodoItem relation not found');
  res.sendStatus(204);
});

// PATCH
router.patch('/:id/todoItems/:itemId', async (req: Request, res: Response) => {
  const categoryId: number = parseInt(req.params.id!);
  const todoItemId: number = parseInt(req.params.itemId!);
  const { todo_item_id: newTodoItemId } = req.body;
  const knex = await getKnex();
  const category = await knex('categories_todo_items').select('*').where({
    category_id: categoryId, todo_item_id: todoItemId
  }).first();
  if (!category) res.sendStatus(404);
  await knex('categories_todo_items')
    .where({ category_id: categoryId, todo_item_id: todoItemId })
    .update({ todo_item_id: newTodoItemId });
  res.sendStatus(200);
});

export default router;
