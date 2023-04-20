import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';

const userRoutes = require('./routes/userRoutes');
const port: number = 3000;
const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
    res.send("Welcomen to basic Users CRUD example!");
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`⚡️ Server is running at http://localhost:${port}`);
});
