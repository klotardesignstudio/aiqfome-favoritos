import http from 'http';
import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = http.createServer(app);

const port = env.PORT;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});

function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Closing server...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server closed. Bye.');
    process.exit(0);
  });

  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('Forced shutdown.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
