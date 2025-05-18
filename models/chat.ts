import mongoose, { Document, Schema } from 'mongoose';

interface Nickname {
    user_id: string;
    nickname: string;
}

export interface IChat extends Document {
    name: string;
    admin_list: string[];
    user_list: string[];
    nickname_list: Nickname[];
    message_list: string[];
}

const NicknameSchema = new Schema<Nickname>({
    user_id: { type: String, required: true },
    nickname: { type: String, required: true, maxlength: 30 }
}, { _id: false });

const ChatSchema = new Schema<IChat>({
    name: { type: String, required: true, maxlength: 50 },
    admin_list: { type: [String], required: true },
    user_list: { type: [String], required: true, validate: [(arr: string[]) => arr.length >= 2 && arr.length <= 5, 'User list must contain between 2 and 5 users.'] },
    nickname_list: { type: [NicknameSchema], required: true },
    message_list: { type: [String], required: true }
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
