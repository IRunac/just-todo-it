import express, { Request, Response } from 'express';
import { DependecyInjection } from '../index';
import { TodoItem } from '../entities/TodoItem';

export const todoItemRoutesInit = (DI: DependecyInjection) => {
  const todoItemRepository = DI.todoItemRepository;
  const categoryRepository = DI.categoryRepository;
  const userRepository = DI.userRepository;
  const boardRepository = DI.boardRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next, id) => {
    const todoItemId: number = parseInt(id);
    const todoItem = await todoItemRepository.findOne({ id: todoItemId });
    if (!todoItem) return res.status(404).send('Todo Item not found');
    req.todoItem = todoItem;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const todoItems = await todoItemRepository.findAll();
    res.status(200).send(todoItems);
  });

  // GET BY ID
  router.get('/:id', async (req: Request, res: Response) => {
    return res.status(200).send(req.todoItem);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const {
      name,
      status,
      completed_increment: completedIncrement,
      failed_increment: failedIncrement,
      user_id: userId,
      board_id: boardId,
      category_id: categoryId
    } = req.body;
    const category = await categoryRepository.findOne({ id: categoryId });
    const user = await userRepository.findOne({ id: userId });
    const board = await boardRepository.findOne({ id: boardId });
    const newTodoItem = {
      name,
      status,
      completed_increment: completedIncrement,
      failed_increment: failedIncrement,
      user,
      board
    } as TodoItem;
    const todoItem = await todoItemRepository.create(newTodoItem);
    if (category) {
      todoItem.categories.add(category);
      category.todo_items.add(todoItem);
    }
    await entityManager.flush();
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    const todoItem = req.todoItem;
    if (!todoItem) return res.status(404).send('Todo Item not found');
    await entityManager.removeAndFlush(todoItem);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const {
      name,
      status,
      completed_increment: completedIncrement,
      failed_increment: failedIncrement,
      user_id: userId,
      board_id: boardId,
      todoItem
    } = req.body;
    todoItem.name ??= name;
    todoItem.status ??= status;
    todoItem.completed_increment ??= completedIncrement;
    todoItem.failed_increment ??= failedIncrement;
    todoItem.board_id ??= boardId;
    todoItem.user_id ??= userId;
    await entityManager.persistAndFlush(todoItem);
    return res.sendStatus(200);
  });

  return router;
};
