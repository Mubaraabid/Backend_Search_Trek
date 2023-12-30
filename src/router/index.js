import { Router } from "express";
import userRouter from "./user.js";

const mainRouter = new Router();

mainRouter.use(userRouter);
export default mainRouter;
