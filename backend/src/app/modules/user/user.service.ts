import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import { Role } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import ApiError from "../../utils/ApiError";
import { createAuthTokens } from "../../utils/authTokens";
import prisma from "../../utils/prisma";
import { ICreateStudentPayload, userSafeSelect } from "./user.interface";

const createStudent = async (payload: ICreateStudentPayload) => {
    const existingStudent = await prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (existingStudent) {
        throw new ApiError(httpStatus.CONFLICT, "An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: Role.STUDENT, // always STUDENT, never taken from the client
        },
        select: userSafeSelect,
    });

    // Log the new student in right away
    const { accessToken, refreshToken } = createAuthTokens(user);

    return { user, accessToken, refreshToken };
};

export const UserService = {
    createStudent,
};
