import { Board, Category, TodoItem, User } from './entities';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import express, { Express, Request, Response } from 'express';
import boardRoutes from './routes/boardRoutes';
import bodyParser from 'body-parser';
import categoryRoutes from './routes/categoryRoutes';
import ormOptions from './mikro-orm.config';
import todoItemRoutes from './routes/todoItemRoutes';
import { userRoutesInit } from './routes/userRoutes';

const port: number = 3000;
const app: Express = express();

interface DependecyInjection {
  orm: MikroORM,
  em: EntityManager,
  userRepository: EntityRepository<User>,
  boardRepository: EntityRepository<Board>,
  categoryRepository: EntityRepository<Category>,
  todoItemRepository: EntityRepository<TodoItem>,
}
export const DI = {} as DependecyInjection;

async function createOrmInstance() {
  const orm: MikroORM = await MikroORM.init(ormOptions);
  return orm;
}

export const getOrmInstance = async () => {
  const orm = await createOrmInstance();
  return orm;
};

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
    app.get('/', (req: Request, res: Response) => {
      res.send('Welcomen to basic Users CRUD example!');
    });

    app.use('/users', userRoutesInit(DI));
    app.use('/boards', boardRoutes);
    app.use('/categories', categoryRoutes);
    app.use('/todoItems', todoItemRoutes);

    app.listen(port, () => {
      console.log(`⚡️ Server is running at http://localhost:${port}`);
    });
  });
