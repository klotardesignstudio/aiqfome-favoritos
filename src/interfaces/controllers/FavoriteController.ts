import { Request, Response, NextFunction } from 'express';
import { addFavoriteSchema } from '../validation/favorite.schemas';
import { container } from '../../container';

export class FavoriteController {
  static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = addFavoriteSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Invalid payload', details: parsed.error.flatten() } });
        return;
      }
      const userId = (req as unknown as { userId?: string }).userId!;
      await container.usecases.addFavorite.execute({ userId, productId: parsed.data.productId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as unknown as { userId?: string }).userId!;
      const out = await container.usecases.listFavorites.execute({ userId });
      res.status(200).json(out);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as unknown as { userId?: string }).userId!;
      const id = Number(req.params.productId);
      await container.usecases.removeFavorite.execute({ userId, productId: id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
