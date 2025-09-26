import { NextFunction, Request, Response } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(err as Error);
    return;
  }

  const isError = err instanceof Error;
  const typed = (isError ? (err as ErrorWithStatus) : undefined) as ErrorWithStatus | undefined;

  const statusCode = typeof typed?.status === 'number' ? typed!.status! : 500;
  const code = typed?.code ?? 'INTERNAL_ERROR';
  const message = isError ? (err as Error).message : 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      code,
    },
  });
}
