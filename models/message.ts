import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    chat_id: string;
    sender_id: string;
    content: string;
    timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
    chat_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
