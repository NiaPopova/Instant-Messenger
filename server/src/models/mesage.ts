import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
    chat_id: string;
    sender_id: string;
    recipient: mongoose.Schema.Types.ObjectId, // here
    content: string;
    timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
    chat_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    content: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);