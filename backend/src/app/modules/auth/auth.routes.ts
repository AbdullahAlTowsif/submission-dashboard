import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import { authLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.post("/login", authLimiter, validateRequest(AuthValidation.login), AuthController.loginUser);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.get("/me", auth(Role.STUDENT, Role.MENTOR), AuthController.getMe);

export const AuthRoutes = router;
