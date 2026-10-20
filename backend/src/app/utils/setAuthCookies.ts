import { Response } from "express";
import { envVars } from "../config/env";

const isProd = envVars.NODE_ENV === "production";

const baseOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
};

const ACCESS_MAX_AGE = 60 * 60 * 1000; // 1 hour
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, { ...baseOptions, maxAge: ACCESS_MAX_AGE });
    res.cookie("refreshToken", refreshToken, { ...baseOptions, maxAge: REFRESH_MAX_AGE });
};

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", baseOptions);
    res.clearCookie("refreshToken", baseOptions);
};
