import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { bold, green, yellow } from 'colorette';

process.on('uncaughtException', error => {
  console.log(error)
  process.exit(1);
});

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(yellow(bold(`database connected successfully!`)))
    server = app.listen(config.port, () => {
      console.log(green(bold(`server is running on port  ${config.port}!`)))
    });
  } catch (err) {
    console.log('failed to connect database!', err)
  }
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        console.log(error)
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
main();

process.on('SIGTERM', () => {
  console.log('SIGTERM is received!')
  if (server) {
    server.close();
  }
});
