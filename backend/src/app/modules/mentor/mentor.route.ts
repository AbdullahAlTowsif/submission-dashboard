import express from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { MentorController } from "./mentor.controller";
import { MentorValidation } from "./mentor.validation";

const router = express.Router();

// Every route in this file is mentor-only
router.use(auth(Role.MENTOR));

router.get("/stats", MentorController.getStats);

router.get(
    "/submissions",
    validateRequest(MentorValidation.listSubmissions),
    MentorController.listSubmissions
);

router.patch(
    "/submissions/:id/status",
    validateRequest(MentorValidation.reviewSubmission),
    MentorController.reviewSubmission
);

export const MentorRoutes = router;
