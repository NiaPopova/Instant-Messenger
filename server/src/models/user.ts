import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    profile_pic: string;
    last_active: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    profile_pic: { type: String, required: true },
    last_active: { type: Date, required: true }
});

export const User = mongoose.model<IUser>('User', UserSchema);