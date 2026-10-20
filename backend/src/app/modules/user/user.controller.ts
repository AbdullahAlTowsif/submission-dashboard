import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setAuthCookies";
import { UserService } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await UserService.createStudent(req.body);

    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Account created and logged in successfully",
        data: user,
    });
});

export const UserController = {
    createStudent,
};
