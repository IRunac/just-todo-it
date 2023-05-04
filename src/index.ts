import express, { Express, Request, Response } from 'express';
import boardRoutes from './routes/boardRoutes';
import bodyParser from 'body-parser';
import categoryRoutes from './routes/categoryRoutes';
import { MikroORM } from '@mikro-orm/core';
import ormOptions from './mikro-orm.config';
import todoItemRoutes from './routes/todoItemRoutes';
import userRoutes from './routes/userRoutes';

const port: number = 3000;
const app: Express = express();

async function createOrmInstance() {
  const orm: MikroORM = await MikroORM.init(ormOptions);
  return orm;
}

export const getOrmInstance = async () => {
  const orm = await createOrmInstance();
  return orm;
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req: Request, res: Response) => {
  res.send('Welcomen to basic Users CRUD example!');
});

app.use('/users', userRoutes);
app.use('/boards', boardRoutes);
app.use('/categories', categoryRoutes);
app.use('/todoItems', todoItemRoutes);

app.listen(port, () => {
  console.log(`⚡️ Server is running at http://localhost:${port}`);
});
