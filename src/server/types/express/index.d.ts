import { Board, Category, TodoItem, User } from '../../entities';

declare module 'express-serve-static-core' {
  export interface Request {
    board?: Board,
    category?: Category,
    user?: User,
    todoItem?: TodoItem
  }
}
