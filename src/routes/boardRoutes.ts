import express, { Request, Response } from 'express';

export const boardRoutesInit = (DI: any) => {
  const boardRepository = DI.boardRepository;
  const userRepository = DI.userRepository;
  const entityManager = DI.em;
  const router = express.Router();

  router.param('id', async (req: Request, res: Response, next, id) => {
    const boardId: number = parseInt(id);
    const board = await boardRepository.findOne({ id: boardId });
    if (!board) return res.status(404).send('Board not found');
    req.body.board = board;
    next();
  });

  // GET ALL
  router.get('/', async (req: Request, res: Response) => {
    const boards = await boardRepository.findAll();
    res.status(200).send(boards);
  });

  // GET BY ID
  router.get('/:id', async (req: Request, res: Response) => {
    return res.status(200).send(req.body.board);
  });

  // POST
  router.post('/', async (req: Request, res: Response) => {
    const { type, user_id: userId } = req.body;
    const user = await userRepository.findOne({ id: userId });
    const newBoard = { type, user };
    await boardRepository.create(newBoard);
    res.sendStatus(201);
  });

  // DELETE
  router.delete('/:id', async (req: Request, res: Response) => {
    await entityManager.removeAndFlush(req.body.board);
    return res.sendStatus(204);
  });

  // PATCH
  router.patch('/:id', async (req: Request, res: Response) => {
    const { type, board } = req.body;
    board.type = type || board.type;
    await entityManager.persistAndFlush(board);
    return res.sendStatus(200);
  });

  return router;
};
