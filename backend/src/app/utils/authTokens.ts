import { Secret } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { jwtHelper } from "../middlewares/jwtHelper";

interface ITokenUser {
    id: string;
    email: string;
    role: Role;
}

export const createAuthTokens = (user: ITokenUser) => {
    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = jwtHelper.generateToken(
        payload,
        envVars.JWT_ACCESS_SECRET as Secret,
        envVars.JWT_ACCESS_EXPIRES as string
    );

    const refreshToken = jwtHelper.generateToken(
        payload,
        envVars.JWT_REFRESH_SECRET as Secret,
        envVars.JWT_REFRESH_EXPIRES as string
    );

    return { accessToken, refreshToken };
};
