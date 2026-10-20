import httpStatus from "http-status-codes";
import ApiError from "../../utils/ApiError";
import prisma from "../../utils/prisma";
import { ICreateSubmissionPayload, submissionSelect } from "./submission.interface";

const createSubmission = async (userId: string, payload: ICreateSubmissionPayload) => {
    // Friendly duplicate check (the DB unique constraint is the real guard)
    const existingSubmission = await prisma.submission.findUnique({
        where: {
            studentId_repoUrl: { studentId: userId, repoUrl: payload.repoUrl },
        },
        select: { id: true },
    });

    if (existingSubmission) {
        throw new ApiError(httpStatus.CONFLICT, "You have already submitted this repository");
    }

    return prisma.submission.create({
        data: {
            projectName: payload.projectName,
            repoUrl: payload.repoUrl,
            liveUrl: payload.liveUrl,
            description: payload.description,
            studentId: userId, // always from the verified token, never from the body
        },
        select: submissionSelect,
    });
};

const getMySubmissions = async (userId: string) => {
    return prisma.submission.findMany({
        where: { studentId: userId },
        orderBy: { createdAt: "desc" },
        select: {
            ...submissionSelect,
            feedbacks: {
                orderBy: { createdAt: "desc" },
                select: { id: true, comment: true, createdAt: true },
            },
        },
    });
};

export const SubmissionService = {
    createSubmission,
    getMySubmissions,
};
