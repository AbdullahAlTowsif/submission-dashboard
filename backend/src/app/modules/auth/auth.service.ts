import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import ApiError from "../../utils/ApiError";
import prisma from "../../utils/prisma";
import { userSafeSelect } from "../user/user.interface";
import { jwtHelper } from "../../middlewares/jwtHelper";
import { envVars } from "../../config/env";
import { Secret } from "jsonwebtoken";
import { createAuthTokens } from "../../utils/authTokens";

const loginUser = async (payload: { email: string; password: string }) => {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    const isPasswordValid = user
        ? await bcrypt.compare(payload.password, user.password)
        : false;

    // Same status and message for "no such user" and "wrong password"
    if (!user || !isPasswordValid) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    const { accessToken, refreshToken } = createAuthTokens(user);

    const { password: _password, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, envVars.JWT_REFRESH_SECRET as Secret);
    } catch {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const user = await prisma.user.findUnique({ where: { id: decodedData.id } });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    return createAuthTokens(user);
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: userSafeSelect,
    });
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
};

export const AuthService = {
    loginUser,
    refreshToken,
    getMe,
};
