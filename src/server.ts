import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorLogger, logger } from './shared/logger';
import { bold, green, yellow } from 'colorette';

process.on('uncaughtException', error => {
  errorLogger.error(error);
  process.exit(1);
});

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    config.env === 'development'
      ? console.log(yellow(bold(`database connected successfully!`)))
      : logger.info(`database connected successfully!`);

    server = app.listen(config.port, () => {
      config.env === 'development'
        ? console.log(green(bold(`server is running on port  ${config.port}!`)))
        : logger.info(`server is running on port ${config.port}!`)
    });
  } catch (err) {
    config.env === 'development'
      ? console.log('failed to connect database!', err)
      : errorLogger.error('failed to connect database!', err);
  }
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        config.env === 'development'
          ? console.log(error)
          : errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
main();

process.on('SIGTERM', () => {
  config.env === 'development'
    ? console.log('SIGTERM is received!')
    : logger.info('SIGTERM is received!');
  if (server) {
    server.close();
  }
});
