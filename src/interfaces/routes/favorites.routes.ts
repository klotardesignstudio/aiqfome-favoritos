import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';
import { hmacAuth } from '../middlewares/hmacAuth';
import { authToken } from '../middlewares/authToken';

export const favoritesRouter = Router();

favoritesRouter.post('/', hmacAuth, authToken, FavoriteController.add);
favoritesRouter.get('/', hmacAuth, authToken, FavoriteController.list);
favoritesRouter.delete('/:productId', hmacAuth, authToken, FavoriteController.remove);
