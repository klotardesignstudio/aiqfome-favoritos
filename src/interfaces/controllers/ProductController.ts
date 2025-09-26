import { Request, Response, NextFunction } from 'express';
import { container } from '../../container';

export class ProductController {
  static async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await container.catalog.listAll();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const product = await container.catalog.getById(id);
      if (!product) {
        res.status(404).json({ error: { message: 'Not Found' } });
        return;
      }
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }
}
