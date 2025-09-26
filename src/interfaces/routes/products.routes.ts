import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export const productsRouter = Router();

productsRouter.get('/', ProductController.list);
productsRouter.get('/:id', ProductController.getById);
