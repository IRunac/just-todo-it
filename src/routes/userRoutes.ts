import express, { Request, Response } from 'express';
import { User, userData } from '../entities/users';

const router = express.Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).send(userData.users);
});

router.get('/:id', (req: Request, res: Response) => {
    //if (!req.params['id']) return;
    const userId: number = parseInt(req.params['id']);
    const user = userData.users.find(user => user.id === userId);
    if (!user) res.sendStatus(404);
    res.status(200).send(user);
});

router.post('/', (req: Request, res: Response) => {
    const isUsersEmpty: Boolean = userData.users.length === 0;
    const newUserId: number = isUsersEmpty ? 0 : userData.users.at(-1)!.id + 1;
    const newUser: User = { ...req.body, age: 'test', id: newUserId};
    userData.users.push(newUser);
    userData.count = userData.users.length;
    res.sendStatus(201);
});

router.delete('/:id', (req: Request, res: Response) => {
    // if (!req.params['id']) return;
    const userId: number = parseInt(req.params['id']!);
    const userToDelete = userData.users.find(user => user.id === userId);
    if (!userToDelete) res.sendStatus(404);
    const userIndex = userData.users.findIndex(user => user === userToDelete);
    userData.users.splice(userIndex, 1);
    userData.count = userData.users.length;
    res.sendStatus(204);
});

router.patch('/:id', (req: Request, res: Response) => {
    //if (!req.params['id']) return;
    const userId: number = parseInt(req.params['id']!);
    const currentUser = userData.users.find(user => user.id === userId);
    if (!currentUser) res.sendStatus(404);
    Object.assign(currentUser!, req.body);
    res.sendStatus(200);
});

module.exports = router;
