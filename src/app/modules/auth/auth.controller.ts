import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catch.async";
import { AuthService } from "./auth.service";
import sendResponse from "../../../shared/response.send";
import { IUser } from "../users/user.interface";
import httpStatus from "http-status";

const signup: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup(req.body);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'signup successfully!',
    data: result
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.login(loginData);
  sendResponse<IUser>(res, {
    statusCode: 200,
    success: true,
    message: 'login successfully!',
    data: result
  });
});

export const authController = {
  signup,
  login
}