import mongoose, { Document } from 'mongoose';
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  cpassword: string;
  role: string;
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
}
