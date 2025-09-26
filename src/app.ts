import express, { Application } from 'express';
import { json, urlencoded } from 'express';
import { healthRouter } from './interfaces/routes/health.routes';
import { usersRouter } from './interfaces/routes/users.routes';
import { authRouter } from './interfaces/routes/auth.routes';
import { favoritesRouter } from './interfaces/routes/favorites.routes';
import { productsRouter } from './interfaces/routes/products.routes';
import { errorHandler } from './interfaces/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/openapi';

export function createApp(): Application {
  const app = express();

  app.use(
    json({
      verify: (req, _res, buf) => {
        // capture raw body for HMAC verification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).rawBody = buf.toString('utf8');
      },
    })
  );
  app.use(urlencoded({ extended: true }));

  app.get('/openapi.json', (_req, res) => res.json(swaggerSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/health', healthRouter);
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);
  app.use('/favorites', favoritesRouter);
  app.use('/products', productsRouter);

  app.use(errorHandler);

  return app;
}
