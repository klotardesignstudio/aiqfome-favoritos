import { Request, Response, NextFunction } from 'express';
import { createUserSchema } from '../validation/user.schemas';
import { container } from '../../container';

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Invalid payload', details: parsed.error.flatten() } });
        return;
      }

      const out = await container.usecases.createUser.execute(parsed.data);
      res.status(201).json(out);
    } catch (err) {
      next(err);
    }
  }
}
