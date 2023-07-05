import 'dotenv/config';
import { Board, Category, TodoItem, User } from './entities';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import express, { Express } from 'express';
import passport, { PassportStatic } from 'passport';
import { authRoutesInit } from './routes/auth';
import { boardRoutesInit } from './routes/boardRoutes';
import bodyParser from 'body-parser';
import { categoryRoutesInit } from './routes/categoryRoutes';
import cookieParser from 'cookie-parser';
import ormOptions from './mikro-orm.config';
import { todoItemRoutesInit } from './routes/todoItemRoutes';
import { userRoutesInit } from './routes/userRoutes';

const app: Express = express();
const port = process.env.PORT;

export interface DependecyInjection {
  orm: MikroORM,
  em: EntityManager,
  userRepository: EntityRepository<User>,
  boardRepository: EntityRepository<Board>,
  categoryRepository: EntityRepository<Category>,
  todoItemRepository: EntityRepository<TodoItem>,
  passport: PassportStatic
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
    DI.passport = passport;

    app.use(passport.initialize());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/auth', authRoutesInit(DI));
    app.use('/users', userRoutesInit(DI));
    app.use('/boards', boardRoutesInit(DI));
    app.use('/categories', categoryRoutesInit(DI));
    app.use('/todoItems', todoItemRoutesInit(DI));

    app.listen(port, () => {
      console.log(`⚡️ Server is running at http://localhost:${port}`);
    });
  });
