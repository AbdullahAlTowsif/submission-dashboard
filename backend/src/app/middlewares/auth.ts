import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { Secret } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import ApiError from "../utils/ApiError";
import { jwtHelper } from "./jwtHelper";

const auth = (...roles: Role[]) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            let token: string | undefined = req.cookies?.accessToken;

            if (!token && req.headers.authorization?.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authenticated");
            }

            let decoded;
            try {
                decoded = jwtHelper.verifyToken(token, envVars.JWT_ACCESS_SECRET as Secret);
            } catch {
                throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
            }

            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, "You do not have permission to do this");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;
