import { Board, Category, TodoItem, User } from '../entities';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-unused-vars
  interface Request {
      user?: User,
      board?: Board,
      category?: Category,
      todoItem?: TodoItem
  }
}
