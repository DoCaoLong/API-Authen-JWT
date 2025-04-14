import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: [{ type: String }],
}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;