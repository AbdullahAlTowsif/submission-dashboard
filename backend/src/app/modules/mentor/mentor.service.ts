import httpStatus from "http-status-codes";
import { Prisma } from "../../../generated/prisma/client";
import { Role, SubmissionStatus } from "../../../generated/prisma/enums";
import ApiError from "../../utils/ApiError";
import prisma from "../../utils/prisma";
import {
    IReviewPayload,
    ISubmissionFilters,
    mentorSubmissionSelect,
} from "./mentor.interface";
import { IOptionsResult } from "../../helper/paginationHelper";

const listSubmissions = async (filters: ISubmissionFilters, options: IOptionsResult) => {
    const { status, search } = filters;
    const { page, limit, skip, sortBy, sortOrder } = options;

    const where: Prisma.SubmissionWhereInput = {
        ...(status && { status }),
        ...(search && {
            OR: [
                { projectName: { contains: search, mode: "insensitive" } },
                { student: { name: { contains: search, mode: "insensitive" } } },
                { student: { email: { contains: search, mode: "insensitive" } } },
            ],
        }),
    };

    const [data, total] = await Promise.all([
        prisma.submission.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { [sortBy]: sortOrder } as Prisma.SubmissionOrderByWithRelationInput,
                { id: "asc" }, // tie-breaker so pages stay stable
            ],
            select: mentorSubmissionSelect,
        }),
        prisma.submission.count({ where }),
    ]);

    return {
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};

// ---------- Aggregated statistics ----------
const getStats = async () => {
    const grouped = await prisma.submission.groupBy({
        by: ["status"],
        _count: { _all: true },
    });

    const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
    for (const row of grouped) {
        const count = row._count._all;
        stats.total += count;
        if (row.status === SubmissionStatus.PENDING) stats.pending = count;
        if (row.status === SubmissionStatus.APPROVED) stats.approved = count;
        if (row.status === SubmissionStatus.REJECTED) stats.rejected = count;
    }
    return stats;
};

// ---------- Review (approve / reject) ----------
const reviewSubmission = async (
    mentorId: string,
    submissionId: string,
    payload: IReviewPayload
) => {
    // 1. Who is acting? Confirm against the database, not just the token.
    const mentor = await prisma.user.findUnique({
        where: { id: mentorId },
        select: { id: true, role: true },
    });
    if (!mentor || mentor.role !== Role.MENTOR) {
        throw new ApiError(httpStatus.FORBIDDEN, "Only mentors can review submissions");
    }

    // 2. Does the resource exist?
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: { id: true, status: true },
    });
    if (!submission) {
        throw new ApiError(httpStatus.NOT_FOUND, "Submission not found");
    }

    // 3. Is this status change allowed? Only PENDING can be reviewed.
    if (submission.status !== SubmissionStatus.PENDING) {
        throw new ApiError(httpStatus.CONFLICT, "This submission has already been reviewed");
    }

    // 4. Update atomically. The `status: PENDING` condition means that if two
    //    mentors click at the same moment, only one update matches.
    return prisma.$transaction(async (tx) => {
        const result = await tx.submission.updateMany({
            where: { id: submissionId, status: SubmissionStatus.PENDING },
            data: { status: payload.status, reviewedAt: new Date() },
        });
        if (result.count === 0) {
            throw new ApiError(httpStatus.CONFLICT, "This submission has already been reviewed");
        }

        if (payload.comment) {
            await tx.feedback.create({
                data: { comment: payload.comment, submissionId, mentorId },
            });
        }

        return tx.submission.findUniqueOrThrow({
            where: { id: submissionId },
            select: mentorSubmissionSelect,
        });
    });
};

export const MentorService = {
    listSubmissions,
    getStats,
    reviewSubmission,
};
