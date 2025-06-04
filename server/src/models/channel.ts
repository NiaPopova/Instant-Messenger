import * as mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required:true
        }
    ],
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    messages: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Message',
        required:false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Channel', channelSchema);