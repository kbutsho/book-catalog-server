"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const global_error_handler_1 = __importDefault(require("./errorHandler/global.error.handler"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// route
// app.use('/api/v1', routes);
app.use(global_error_handler_1.default);
app.get('/', (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'welcome home!',
        path: req.originalUrl
    });
});
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'not found!',
        issues: [{
                path: req.originalUrl,
                message: 'api not found!',
            }]
    });
    next();
});
exports.default = app;
