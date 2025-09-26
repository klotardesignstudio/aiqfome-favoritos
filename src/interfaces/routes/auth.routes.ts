import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { hmacAuth } from '../middlewares/hmacAuth';

export const authRouter = Router();

authRouter.post('/login', hmacAuth, AuthController.login);
