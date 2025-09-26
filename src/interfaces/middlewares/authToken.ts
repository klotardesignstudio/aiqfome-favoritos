import { NextFunction, Request, Response } from 'express';
import { container } from '../../container';

export function authToken(req: Request, res: Response, next: NextFunction): void {
  const auth = req.header('authorization') || req.header('Authorization') || '';
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    res.status(401).json({ error: { message: 'Missing or invalid Authorization header', code: 'NO_TOKEN' } });
    return;
  }
  const payload = container.tokenService.verify(token);
  if (!payload) {
    res.status(401).json({ error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
    return;
  }
  (req as unknown as { userId?: string }).userId = payload.sub;
  next();
}
