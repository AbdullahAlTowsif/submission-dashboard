import express from "express";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { authLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.post("/signup", authLimiter, validateRequest(UserValidation.createUser), UserController.createStudent);

export const UserRoutes = router;
