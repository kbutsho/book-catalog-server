import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./errorHandler/global.error.handler";
import httpStatus from 'http-status';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
// app.use('/api/v1', routes);
app.use(globalErrorHandler);
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'welcome!',
    path: req.originalUrl
  })
})
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'not found!',
    issues: [{
      path: req.originalUrl,
      message: 'api not found!',
    }]
  });
  next();
});

export default app;


