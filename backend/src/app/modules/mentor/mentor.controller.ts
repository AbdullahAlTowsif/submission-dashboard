import httpStatus from "http-status-codes";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ISubmissionFilters } from "./mentor.interface";
import { MentorService } from "./mentor.service";
import pick from "../../helper/pick";
import { PAGINATION_FIELDS, SUBMISSION_FILTER_FIELDS } from "./mentor.constant";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";


const listSubmissions = catchAsync(async (req, res) => {
    const query = req.query as Record<string, unknown>;

    const filters = pick(query, [...SUBMISSION_FILTER_FIELDS]) as ISubmissionFilters;
    const options = paginationHelper.calculatePagination(
        pick(query, [...PAGINATION_FIELDS]) as IOptions
    );

    const { data, meta } = await MentorService.listSubmissions(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Submissions retrieved successfully",
        meta,
        data,
    });
});

const getStats = catchAsync(async (_req, res) => {
    const stats = await MentorService.getStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Statistics retrieved successfully",
        data: stats,
    });
});

const reviewSubmission = catchAsync(async (req, res) => {
    const mentorId = req.user?.id;
    if (!mentorId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const submission = await MentorService.reviewSubmission(
        mentorId,
        req.params.id as string,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Submission ${submission.status.toLowerCase()} successfully`,
        data: submission,
    });
});

export const MentorController = {
    listSubmissions,
    getStats,
    reviewSubmission,
};
