import mongoose, { Document, Schema } from 'mongoose';

export interface IMessageHistory extends Document {
    message_id: string;
    edited_at: Date;
    original_content: string;
    edited_content: string;
    edited_by?: string;
}

const MessageHistorySchema = new Schema<IMessageHistory>({
    message_id: { type: String, required: true },
    edited_at: { type: Date, required: true },
    original_content: { type: String, required: true },
    edited_content: { type: String, required: true },
    edited_by: { type: String }
});

export const MessageHistory = mongoose.model<IMessageHistory>('MessageHistory', MessageHistorySchema);
