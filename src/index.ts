import 'dotenv/config';
import { Board, Category, TodoItem, User } from './entities';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import express, { Express, Request, Response } from 'express';
import { boardRoutesInit } from './routes/boardRoutes';
import bodyParser from 'body-parser';
import { categoryRoutesInit } from './routes/categoryRoutes';
import dotenv from 'dotenv';
import ormOptions from './mikro-orm.config';
import path from 'path';
import { todoItemRoutesInit } from './routes/todoItemRoutes';
import { userRoutesInit } from './routes/userRoutes';
const { createServer, ViteDevServer } = require('vite');

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

export interface DependecyInjection {
  orm: MikroORM,
  em: EntityManager,
  userRepository: EntityRepository<User>,
  boardRepository: EntityRepository<Board>,
  categoryRepository: EntityRepository<Category>,
  todoItemRepository: EntityRepository<TodoItem>,
}
export const DI = {} as DependecyInjection;

MikroORM.init(ormOptions)
  .then(ormInstance => {
    DI.orm = ormInstance;
    DI.em = DI.orm.em;
    DI.userRepository = DI.em.getRepository(User);
    DI.boardRepository = DI.em.getRepository(Board);
    DI.categoryRepository = DI.em.getRepository(Category);
    DI.todoItemRepository = DI.em.getRepository(TodoItem);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    createServer({ server: { middlewareMode: true } })
      .then((viteServer: typeof ViteDevServer) => {
        console.log('create server');
        app.use(viteServer.middlewares);

        app.get('/', (req: Request, res: Response) => {
          console.log('base route');
          res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
        });

        app.use('/users', userRoutesInit(DI));
        app.use('/boards', boardRoutesInit(DI));
        app.use('/categories', categoryRoutesInit(DI));
        app.use('/todoItems', todoItemRoutesInit(DI));

        app.listen(port, () => {
          console.log(path.join(__dirname, 'client', 'index.html'));
          console.log(`⚡️ Server is running at http://localhost:${port}`);
        });
      });
  });
