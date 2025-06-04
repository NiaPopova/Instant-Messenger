
import { channel } from 'diagnostics_channel';
import Channel from '../models/channel';
import { User } from "../models/user";
import mongoose from 'mongoose';

export const createChannel = async (request, response) => {
    try {
        const {name, members} = request.body;
        const userId = request.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return response.status(400).json('Admin not found');
        }

        const validMembers = await User.find({ _id: { $in:members }});

        if (validMembers.length !== members.length) {
            return response.status(400).json('Invalid users');
        }

        const newChannel = new Channel({
            name, 
            admin: userId,
            members
        });

        await newChannel.save();
        return response.status(200).json({channel: newChannel});

    } catch (err) {
        console.log({err});
        return response.status(500).json('Server Error');
    }
};

export const getUserChannels = async (request, response) => {
    try {
        
        const userId = new mongoose.Types.ObjectId(request.userId);
        const channels = await Channel.find({
            $or: [{admin: userId}, {members: userId}],
        }).sort({updatedAt: -1});

        return response.status(200).json(channels);

    } catch (err) {
        console.log({err});
        return response.status(500).json('Server Error');
    }
};

export const getChannelMessages = async (request, response) => {
    try {
        const {channelId} = request.params;

        const channel = await Channel.findById(channelId).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'name email _id profile_pic',
            },
        });

        if (!channel) {
            return response.status(404).json('Not found');
        }

        const messages = channel.messages;

        return response.status(200).json({messages});

    } catch (err) {
        console.log({err});
        return response.status(500).json('Server Error');
    }
};