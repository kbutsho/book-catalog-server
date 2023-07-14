"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
const logger_1 = require("./shared/logger");
const colorette_1 = require("colorette");
process.on('uncaughtException', error => {
    logger_1.errorLogger.error(error);
    process.exit(1);
});
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            index_1.default.env === 'development'
                ? console.log((0, colorette_1.yellow)((0, colorette_1.bold)(`database connected successfully!`)))
                : logger_1.logger.info(`database connected successfully!`);
            server = app_1.default.listen(index_1.default.port, () => {
                index_1.default.env === 'development'
                    ? console.log((0, colorette_1.green)((0, colorette_1.bold)(`server is running on port  ${index_1.default.port}!`)))
                    : logger_1.logger.info(`server is running on port ${index_1.default.port}!`);
            });
        }
        catch (err) {
            index_1.default.env === 'development'
                ? console.log('failed to connect database!', err)
                : logger_1.errorLogger.error('failed to connect database!', err);
        }
        process.on('unhandledRejection', error => {
            if (server) {
                server.close(() => {
                    index_1.default.env === 'development'
                        ? console.log(error)
                        : logger_1.errorLogger.error(error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
main();
process.on('SIGTERM', () => {
    index_1.default.env === 'development'
        ? console.log('SIGTERM is received!')
        : logger_1.logger.info('SIGTERM is received!');
    if (server) {
        server.close();
    }
});
