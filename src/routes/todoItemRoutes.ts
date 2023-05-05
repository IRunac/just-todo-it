import express, { Request, Response } from 'express';

export const todoItemRoutesInit = (DI: any) => {
  const todoItemRepository = DI.todoItemRepository;
  const userRepository = DI.userRepository;
  const boardRepository = DI.boardRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next, id) => {
    const todoItemId: number = parseInt(id);
    const todoItem = await todoItemRepository.findOne({ id: todoItemId });
    if (!todoItem) return res.status(404).send('Todo Item not found');
    req.body.todoItem = todoItem;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const todoItems = await todoItemRepository.findAll();
    res.status(200).send(todoItems);
  });

  // GET BY ID
  router.get('/:id', async (req: Request, res: Response) => {
    return res.status(200).send(req.body.todoItem);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const {
      name,
      status,
      completed_increment: completedIncrement,
      failed_increment: failedIncrement,
      user_id: userId,
      board_id: boardId
    } = req.body;
    const user = await userRepository.findOne({ id: userId });
    const board = await boardRepository.findOne({ id: boardId });
    const newTodoItem = {
      name,
      status,
      completed_increment: completedIncrement,
      failed_increment: failedIncrement,
      user,
      board
    };
    await todoItemRepository.create(newTodoItem);
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    await entityManager.removeAndFlush(req.body.todoItem);
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
    todoItem.name = name || todoItem.name;
    todoItem.status = status || todoItem.status;
    todoItem.completed_increment = completedIncrement || todoItem.completed_increment;
    todoItem.failed_increment = failedIncrement || todoItem.failed_increment;
    todoItem.board_id = boardId || todoItem.board_id;
    todoItem.user_id = userId || todoItem.user_id;
    await entityManager.persistAndFlush(todoItem);
    return res.sendStatus(200);
  });

  return router;
};
