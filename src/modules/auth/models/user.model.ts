import mongoose, { Document, Schema } from 'mongoose';

// {
//   "id": "64a8c92f9e1b8c1234567890",
//   "name": "Nguyen Van A",
//   "email": "nguyenvana@example.com",
//   "role": "user",
//   "avatar": "https://example.com/uploads/avatars/64a8c92f.png",
//   "isVerified": true,
//   "language": "vi",
//   "createdAt": "2023-07-08T10:25:30.000Z",
//   "lastLogin": "2025-04-14T08:10:00.000Z",
//   "status": "active",
//   "phoneNumber": "+84981234567",
//   "2faEnabled": false,
//   "subscription": {
//     "plan": "premium",
//     "expiresAt": "2025-07-08T00:00:00.000Z"
//   },
//   "permissions": [
//     "read:dashboard",
//     "update:profile"
//   ]
// }


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  isVerified: boolean;
  role?: string;
  avatar?: string;
  language?: string;
  lastLogin?: Date;
  status?: string;
  phoneNumber?: string;
  permissions?: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  avatar: { type: String, default: '' },
  language: { type: String, default: 'vi' },
  lastLogin: { type: Date },
  status: { type: String, default: 'active' },
  phoneNumber: { type: String, default: '' },
  permissions: { type: [String], default: [] },
}, { timestamps: true });

// Middleware hash password nếu cần (ví dụ với bcrypt)
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }
//   next();
// });

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;