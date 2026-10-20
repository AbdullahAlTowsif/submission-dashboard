import httpStatus from "http-status-codes";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubmissionService } from "./submission.service";

const createSubmission = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const submission = await SubmissionService.createSubmission(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project submitted successfully",
    data: submission,
  });
});

const getMySubmissions = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const submissions = await SubmissionService.getMySubmissions(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your submissions retrieved successfully",
    data: submissions,
  });
});

export const SubmissionController = {
  createSubmission,
  getMySubmissions,
};
