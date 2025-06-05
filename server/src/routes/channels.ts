import express from 'express';
import { Channel } from '../models/channel';
import { User } from '../models/user';

const router = express.Router();

// Get all channels
router.get('/', async (req, res) => {
    const channels = await Channel.find();
    res.status(200).json(channels);
});

// Create a new channel
router.post('/', async (req, res) => {
    try {
        const { name, admin_list, user_list, nickname_list, message_list } = req.body;

        const newChannel = new Channel({
            name,
            admin_list,
            user_list,
            nickname_list,
            message_list
        });

        await newChannel.save();
        res.status(201).json(newChannel);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// Create a new channel
router.post('/private-channel/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
    try {
        const { firstUser, secondUser } = request.params;

        // 1) Try to find an existing channel:
        const existingChannel = await Channel.findOne({
            admin_list: { $all: [firstUser, secondUser] },
            $and: [
                { user_list: { $all: [firstUser, secondUser] } },
                { user_list: { $size: 2 } }
            ]
        });

        if (existingChannel) {
            // If it already exists, just return it:
            return response.status(200).json(existingChannel);
        }

        // 2) Otherwise, build a new Channel document with “private‐chat” defaults:
        //    - admin_list: [ firstUser ]
        //    - user_list: [ firstUser, secondUser ]
        //    - nickname_list: [] (or you can add default nicknames if you want)
        //    - message_list: [] (start with no messages)
        //
        //    For the `name`, you could generate a default like "private-<firstUser>-<secondUser>"
        //    or allow the client to pass a custom naming via req.body. Here’s one approach:
        const defaultName = `private-${firstUser}-${secondUser}`.slice(0, 50);

        const newChannel = new Channel({
            name: request?.body?.name || defaultName,
            admin_list: [firstUser, secondUser],
            user_list: [firstUser, secondUser],
            nickname_list: [],
            message_list: []
        });

        await newChannel.save();
        return response.status(201).json(newChannel);
    } catch (err) {
        return response.status(400).json({ error: (err as Error).message });
    }
});

// Get channel by id
router.get('/:id', async (req, res) => {
    const channel = await Channel.findById(req.params.id);
    if (!channel)
        res.status(404).json({ error: 'Channel not found' });
    res.status(201).json(channel);
});

export default router;