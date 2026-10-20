import { rateLimit } from "express-rate-limit";
import httpStatus from "http-status-codes";
import ApiError from "../utils/ApiError";

// Limits submissions per logged-in user: 5 per 10 minutes.
// Must run AFTER auth() so req.user is available.
export const submissionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id ?? "unauthenticated",
    handler: (_req, _res, next) =>
        next(
            new ApiError(
                httpStatus.TOO_MANY_REQUESTS,
                "Too many submissions. Please wait a few minutes and try again."
            )
        ),
});

// Limits login/signup attempts per IP: 10 per 15 minutes (slows brute-force and spam signups)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, _res, next) =>
        next(
            new ApiError(
                httpStatus.TOO_MANY_REQUESTS,
                "Too many attempts. Please try again later."
            )
        ),
});
