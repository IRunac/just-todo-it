import { Board, Category, TodoItem, User } from '../../entities';

export interface RequestContext {
  board?: Board,
  category?: Category,
  user?: User,
  todoItem?: TodoItem
}

declare module 'express-serve-static-core' {
  export interface Request {
    context: RequestContext,
  }
}
