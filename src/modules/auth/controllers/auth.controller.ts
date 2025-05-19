import { Request, Response } from "express";
import authService from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
    LoginDTO,
    loginWithCaptchaDTO,
    RegisterDTO,
} from "~/modules/auth/dtos/auth.dto";
import { HttpResponse } from "~/utils/http-response";
import { StatusCodes } from "http-status-codes";
import { verifyCaptcha } from "~/utils/captcha";
import jwt from "jsonwebtoken";
import { validateEmail, validatePassword } from "~/utils/validators";
import { ConfigEnvironment } from "~/config/env";
import { HttpError } from "~/utils/HttpError";

export const register = async (req: Request, res: Response) => {
    try {
        const data = req.body as RegisterDTO;
        if (!validateEmail(data.email).valid) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(
                    HttpResponse.badRequest(
                        validateEmail(data.email).error,
                        validateEmail(data.email).message
                    )
                );
        }
        if (!validatePassword(data.password).valid) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(
                    HttpResponse.badRequest(
                        validatePassword(data.password).error,
                        validatePassword(data.password).message
                    )
                );
        }
        const user = await authService.register(data);
        res.status(StatusCodes.CREATED).json({ user });
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json(
            HttpResponse.conflict(error.message)
        );
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginDTO;
        if (!validateEmail(email)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(HttpResponse.badRequest([], "Invalid email format"));
        }
        const { accessToken, refreshToken, user } = await authService.login(
            email,
            password
        );
        res.json({ accessToken, refreshToken, user });
    } catch (error: any) {
        res.status(StatusCodes.UNAUTHORIZED).json(
            HttpResponse.unauthorized(error.message)
        );
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken, userId } = req.body;
    const newAccessToken = await authService.refresh(userId, refreshToken);
    res.json({ accessToken: newAccessToken });
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken, userId } = req.body;
    await authService.logout(userId, refreshToken);
    res.json({ message: "Logged out" });
};

export const logoutAll = async (req: AuthRequest, res: Response) => {
    if (!req.userId)
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(HttpResponse.unauthorized());
    await authService.logoutAll(req.userId);
    res.json({ message: "Logged out from all devices" });
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.json({ message: "Reset email sent if account exists" });
    } catch (error: any) {
        console.error("Error during forgot password:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            HttpResponse.internalServerError(error.message)
        );
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ message: "Password reset successfully" });
};

export const loginWithCaptcha = async (req: Request, res: Response) => {
    try {
        const { email, password, captchaToken } =
            req.body as loginWithCaptchaDTO;
        
        if (!validateEmail(email)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json(HttpResponse.badRequest([], "Invalid email format"));
        }
        
        // Xác thực CAPTCHA chỉ khi không phải môi trường development
        if (ConfigEnvironment.NODE_ENV !== "development") {
            const isHuman = await verifyCaptcha(captchaToken);
            if (!isHuman)
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ message: "Captcha validation failed!" });
        }

        const loginResult = await authService.loginWith2FA(email, password);

        if (loginResult.requires2FA) {
            return res.status(StatusCodes.OK).json({
                requires2FA: true,
                tempToken: loginResult.tempToken,
                message: "OTP required",
            });
        }

        return res.status(StatusCodes.OK).json(loginResult);
    } catch (error: any) {
        if (error instanceof HttpError) {
            // Lỗi do nghiệp vụ, có status code rõ ràng
            return res.status(StatusCodes.UNAUTHORIZED).json(HttpResponse.unauthorized(error.message, error.errorCode));
        }
        
        // Lỗi không lường trước (internal server error)
        console.error('Unexpected error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            HttpResponse.internalServerError("Internal server error")
        );
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { otpCode, tempToken } = req.body;
        const result = await authService.verify2FA(tempToken, otpCode);
        if (!result)
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: "Invalid OTP" });
        return res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        console.error("Error during OTP verification:", error);
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json(HttpResponse.unauthorized(error.message));
    }
};

export const enable2FA = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const result = await authService.enable2FA(userId);
        return res.status(StatusCodes.OK).json(result);
    } catch (error: any) {
        console.error("Error during 2FA setup:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(HttpResponse.internalServerError(error.message));
    }
};

export const disable2FA = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        await authService.remove2FA(userId);
        return res
            .status(StatusCodes.OK)
            .json(HttpResponse.twoFactorDisabled());
    } catch (error: any) {
        console.error("Error disabling 2FA:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(HttpResponse.internalServerError(error.message));
    }
};

export const verifyAccountFromToken = async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Missing verification token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
        };
        await authService.verifyAccount(decoded.userId);
        res.json({ message: "Account verified successfully" });
    } catch (err) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
