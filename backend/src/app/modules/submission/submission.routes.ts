import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import { submissionLimiter } from "../../middlewares/rateLimiter";
import validateRequest from "../../middlewares/validateRequest";
import { SubmissionController } from "./submission.controller";
import { SubmissionValidation } from "./submission.validation";

const router = express.Router();

router.post(
  "/",
  auth(Role.STUDENT),
  submissionLimiter,
  validateRequest(SubmissionValidation.createSubmission),
  SubmissionController.createSubmission
);

router.get("/mine", auth(Role.STUDENT), SubmissionController.getMySubmissions);

export const SubmissionRoutes = router;
