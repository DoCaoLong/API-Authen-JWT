import { RegisterDTO } from "~/modules/auth/dtos/auth.dto";
import UserModel, { IUser } from "../models/user.model";

class UserRepository {
    async register(userData: RegisterDTO): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    async addRefreshToken(userId: string, token: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $push: { refreshTokens: token },
        });
    }

    async removeRefreshToken(userId: string, token: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $pull: { refreshTokens: token },
        });
    }

    async clearAllRefreshTokens(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            $set: { refreshTokens: [] },
        });
    }

    async update2FA(id: string, update: any): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, update, { new: true });
    }
}
export default new UserRepository();
