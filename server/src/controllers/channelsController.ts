import * as express from 'express';
import { User } from "../models/user";
import { Channel } from "../models/channel";

export const getAllChannels = async (request: express.Request, response: express.Response) => {
    try{
        const channels = await Channel.find();
        response.status(200).json(channels);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching channels' });
    }
};

export const createNewChannel = async (request: express.Request, response: express.Response) => {
    try {
        const { name, admin_list, user_list, nickname_list, message_list } = request.body;

        const newChannel = new Channel({
            name,
            admin_list,
            user_list,
            nickname_list,
            message_list
        });

        await newChannel.save();
        response.status(201).json(newChannel);
    } catch (err) {
        response.status(400).json({ error: (err as Error).message });
    }
};

export const createNewPrivateChannel = async (request: express.Request, response: express.Response) => {
    try {
        const { firstUser, secondUser } = request.params;
        
        const existingChannel = await Channel.findOne({
            admin_list: { $all: [firstUser, secondUser] },
            $and: [
                { user_list: { $all: [firstUser, secondUser] } },
                { user_list: { $size: 2 } }
            ]
        });

        if (existingChannel) {
           return response.status(200).json(existingChannel);
        }
        
        const newChannel = new Channel({
            name: request?.body?.name,
            admin_list: [firstUser, secondUser],
            user_list: [firstUser, secondUser],
            nickname_list: [],
            message_list: [],
            isPrivate: true
        });
        
        await newChannel.save();
        response.status(201).json(newChannel);
    } catch (err) {
        response.status(400).json({ error: (err as Error).message });
    }
};

export const getChannelById = async (request: express.Request, response: express.Response) => {
    try {
        const channel = await Channel.findById(request.params.id);

        if (!channel)
        {
            return response.status(404).json({ error: 'Channel not found' });
        }

        response.status(201).json(channel);
    } catch (error) {
        response.status(500).json({ error: 'Error fetching channel' });
    }
};