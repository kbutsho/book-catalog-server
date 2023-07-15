import express from "express";
import validateRequest from "../../middleware/validationRequest";
import { UserValidation } from "../users/user.validation";
import { authController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post('/signup', validateRequest(UserValidation.createUserZodSchema), authController.signup);
router.post('/login', validateRequest(AuthValidation.loginZodSchema), authController.login);

export const AuthRoutes = router;