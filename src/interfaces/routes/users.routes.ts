import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { hmacAuth } from '../middlewares/hmacAuth';

export const usersRouter = Router();

usersRouter.post('/', hmacAuth, UserController.create);
