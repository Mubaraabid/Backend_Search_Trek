import { Router } from "express";
import userController from "../controller/user.js";
import userValidator from "../validator/user.js";

const userRouter = new Router();
userRouter.post("/login",userValidator.loginValidator, userController.Login);
userRouter.post("/signup",userValidator.signUpValidator, userController.signUp);
userRouter.post("/confirmOtp", userController.checkOtp);
userRouter.post("/refreshOtp", userController.regenerateOtp);

export default userRouter;