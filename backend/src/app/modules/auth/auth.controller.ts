import httpStatus from "http-status-codes";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { clearAuthCookies, setAuthCookies } from "../../utils/setAuthCookies";
import { AuthService } from "./auth.service";


const loginUser = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.loginUser(req.body);

    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully",
        data: user,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const tokens = await AuthService.refreshToken(token);

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Token refreshed successfully",
        data: null,
    });
});

const logout = catchAsync(async (_req, res) => {
    clearAuthCookies(res);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged out successfully",
        data: null,
    });
});

const getMe = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const user = await AuthService.getMe(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: user,
    });
});

export const AuthController = {
    loginUser,
    refreshToken,
    logout,
    getMe,
};
