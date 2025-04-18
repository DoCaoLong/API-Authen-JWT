import { Request, Response } from "express";
import authService from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { RegisterDTO } from "~/modules/auth/dtos/auth.dto";
import { HttpResponse } from "~/utils/http-response";
import { StatusCodes } from "http-status-codes";
import { verifyCaptcha } from "~/utils/captcha";

export const register = async (req: Request, res: Response) => {
    try {
        const data = req.body as RegisterDTO;
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
        const { email, password } = req.body;
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
        const { email, password, captchaToken } = req.body;

        if (process.env.NODE_ENV !== "development") {
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
        // console.error("Error during login with captcha:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(HttpResponse.internalServerError(error.message));
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
        const result = await authService.setup2FA(userId);
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
