import UserModel, { IUser } from '../models/user.model';

class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
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
    await UserModel.findByIdAndUpdate(userId, { $push: { refreshTokens: token } });
  }

  async removeRefreshToken(userId: string, token: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $pull: { refreshTokens: token } });
  }

  async clearAllRefreshTokens(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
  }
}
export default new UserRepository();