import { Request, Response, NextFunction } from 'express';
import { loginSchema } from '../validation/auth.schemas';
import { container } from '../../container';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { message: 'Invalid payload', details: parsed.error.flatten() } });
        return;
      }

      const out = await container.usecases.authenticateUser.execute(parsed.data);
      res.status(200).json(out);
    } catch (err) {
      next(err);
    }
  }
}
