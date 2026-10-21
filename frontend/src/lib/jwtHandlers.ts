"use server";

import jwt from "jsonwebtoken";

export const verifyAccessToken = async (token: string) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
            algorithms: ["HS256"],
        }) as jwt.JwtPayload;

        return {
            success: true,
            message: "Token is valid",
            payload,
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Invalid token",
        };
    }
};
