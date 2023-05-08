import express, { Request, Response } from 'express';
import { Category } from '../entities/Category';

export const categoryRoutesInit = (DI: any) => {
  const categoryRepository = DI.categoryRepository;
  const todoItemRepository = DI.todoItemRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next, id) => {
    const categoryId: number = parseInt(id);
    const searchString = 'todoItem';
    const isTodoItemRoute = req.originalUrl.includes(searchString);
    const category = await categoryRepository.findOne(
      { id: categoryId },
      { populate: isTodoItemRoute ? ['todo_items'] : [] }
    );
    if (!category) return res.status(404).send('Category not found');
    req.body.category = category;
    next();
  });

  router.param('itemId', async (req: Request, res: Response, next, id) => {
    const itemId: number = parseInt(id);
    const todoItem = await todoItemRepository.findOne({ id: itemId });
    if (!todoItem) return res.status(404).send('Todo Item not found');
    req.body.todoItem = todoItem;
    next();
  });

  router.use('/:id/todoItems', (req: Request, res: Response, next) => {
    req.body.todoItems = req.body.category.todo_items.getItems();
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const categories = await categoryRepository.findAll();
    res.status(200).send(categories);
  });

  // GET BY ID
  router.get('/:id', async (req: Request, res: Response) => {
    res.status(200).send(req.body.category);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const newCategory: Category = { ...req.body };
    await categoryRepository.insert(newCategory);
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    await entityManager.removeAndFlush(req.body.category);
    res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { name, color, value, max_value: maxValue, user_id: userId, category } = req.body;
    category.name = name || category.name;
    category.color = color || category.color;
    category.value = value || category.value;
    category.max_value = maxValue || category.max_value;
    category.user_id = userId || category.user_id;
    await entityManager.persistAndFlush(category);
    res.sendStatus(200);
  });

  // CATEGORY - TODO ITEMS routes

  // GET ALL ITEMS BY CATEGORY ID
  router.get('/:id/todoItems', async (req: Request, res: Response) => {
    res.status(200).send(req.body.todoItems);
  });

  // POST
  router.post('/:id/todoItems', async (req: Request, res: Response) => {
    const { todo_item_id: todoItemId } = req.body;
    const todoItem = await todoItemRepository.findOne({ id: todoItemId });
    if (!todoItem) return res.status(404).send('Todo Item not found');
    req.body.category.todo_items.add(todoItem);
    return res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id/todoItems/:itemId', async (req: Request, res: Response) => {
    req.body.category.todo_items.remove(req.body.todoItem);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id/todoItems/:itemId', async (req: Request, res: Response) => {
    const { todo_item_id: newTodoItemId } = req.body;
    const newTodoItem = await todoItemRepository.findOne({ id: newTodoItemId });
    if (!newTodoItem) return res.status(404).send('Todo Item not found');
    req.body.category.todo_items.remove(req.body.todoItem);
    req.body.category.todo_items.add(newTodoItem);
    return res.sendStatus(200);
  });

  return router;
};
