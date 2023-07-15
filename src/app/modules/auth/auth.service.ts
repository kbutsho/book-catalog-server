import httpStatus from "http-status";
import ApiError from "../../../errorHandler/api.error";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { ILoginUser } from "./auth.interface";

const signup = async (data: IUser): Promise<IUser | null> => {
  const isExist = await User.findOne({ email: data.email });
  if (isExist) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "email already exist!")
  }
  const user = await User.create(data);
  return user;
}

const login = async (data: ILoginUser): Promise<IUser> => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found!');
  }
  if (user.password && !(await User.isPasswordMatched(data.password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }
  return user;
};

export const AuthService = {
  signup,
  login
};
