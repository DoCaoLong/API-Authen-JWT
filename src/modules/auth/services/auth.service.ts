import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";
import userRepository from "../repositories/user.repository";
import { sendResetPasswordEmail } from "../../../utils/mailer";
import { HttpError } from "~/utils/HttpError";
import { RegisterDTO } from "~/modules/auth/dtos/auth.dto";
import speakeasy from "speakeasy"; // tạo mã OTP 2FA
import qrcode from "qrcode";

class AuthService {
    async register(data: RegisterDTO): Promise<IUser> {
        const existEmail = await userRepository.findByEmail(data.email);
        if (existEmail) {
            throw new HttpError("Email is exist", 400);
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.register({
            ...data,
            email: data.email.toLowerCase(),
            password: hashedPassword,
        });
        const { password: _, ...userNotPassword } = user.toObject();
        return userNotPassword as IUser;
    }

    async login(
        email: string,
        password: string
    ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpError("Invalid credentials", 401);
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await userRepository.addRefreshToken(user._id, refreshToken);
        const { password: _, ...userNotPassword } = user.toObject();
        return { accessToken, refreshToken, user: userNotPassword as IUser };
    }

    async refresh(userId: string, refreshToken: string): Promise<string> {
        try {
            const user = await userRepository.findById(userId);
            if (!user || !user.refreshTokens.includes(refreshToken)) {
                throw new Error("Invalid refresh token");
            }
            return generateAccessToken(user);
        } catch (err) {
            throw new Error("Token refresh failed: " + (err as Error).message);
        }
    }

    async logout(userId: string, refreshToken: string): Promise<void> {
        try {
            await userRepository.removeRefreshToken(userId, refreshToken);
        } catch (err) {
            throw new Error("Logout failed: " + (err as Error).message);
        }
    }

    async logoutAll(userId: string): Promise<void> {
        try {
            await userRepository.clearAllRefreshTokens(userId);
        } catch (err) {
            throw new Error("Logout all failed: " + (err as Error).message);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) return;
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET!,
                { expiresIn: "15m" }
            );
            await sendResetPasswordEmail(user.email, token);
        } catch (err) {
            throw new Error(
                "Forgot password failed: " + (err as Error).message
            );
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
                userId: string;
            };
            const user = await userRepository.findById(decoded.userId);
            if (!user) throw new Error("User not found");
            user.password = await bcrypt.hash(newPassword, 10);
            user.refreshTokens = [];
            await user.save();
        } catch (err) {
            throw new Error("Reset password failed: " + (err as Error).message);
        }
    }

    async loginWith2FA(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpError("Invalid credentials", 401);
        }

        // Kiểm tra xem người dùng có bật 2FA không
        if (user.twoFactorEnabled) {
            // Tạo 1 mã tạm thời để xác thực 2FA
            const tempToken = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: "10m" }
            );
            return { requires2FA: true, tempToken };
        }
        // Nếu không bật 2FA thì trả về user, accessToken và refreshToken
        const { password: _, ...userNotPassword } = user.toObject();
        const safeUser = userNotPassword as IUser;
        const accessToken = generateAccessToken(safeUser);
        const refreshToken = generateRefreshToken(safeUser);
        await userRepository.addRefreshToken(user._id, refreshToken);
        return { accessToken, refreshToken, user: safeUser };
    }

    async verify2FA(tempToken: string, otpCode: string) {
        const payload = jwt.verify(tempToken, process.env.JWT_SECRET!) as {
            userId: string;
        };
        const user = await userRepository.findById(payload.userId);
        if (!user) throw new Error("User not found");

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token: otpCode,
        });
        if (!verified) throw new Error("Invalid OTP");

        // Nếu OTP hợp lệ thì tạo accessToken và refreshToken
        const { password: _, ...userNotPassword } = user.toObject();
        const safeUser = userNotPassword as IUser;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        return { accessToken, refreshToken, user: safeUser };
    }

    async setup2FA(userId: string) {
        const secret = speakeasy.generateSecret({ name: `MyApp (${userId})` });
        await userRepository.update2FA(userId, {
            twoFactorSecret: secret.base32,
            twoFactorEnabled: true,
        });

        const qrCode = await qrcode.toDataURL(secret.otpauth_url!);
        return {
            qrCode,
            secret: secret.base32,
            message: "Scan QR with Google Authenticator",
        };
    }

    async remove2FA(userId: string) {
        await userRepository.update2FA(userId, {
            twoFactorSecret: null,
            twoFactorEnabled: false,
        });
    }
}

export default new AuthService();
