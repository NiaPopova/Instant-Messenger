import express from 'express';
import { Channel } from '../models/channel';
import { User } from '../models/user';

const router = express.Router();

router.get('/', async (req, res) => {
    const channels = await Channel.find();
    res.status(200).json(channels);
});

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

router.post('/private-channel/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
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
        return response.status(201).json(newChannel);
    } catch (err) {
        return response.status(400).json({ error: (err as Error).message });
    }
});

router.get('/:id', async (req, res) => {
    const channel = await Channel.findById(req.params.id);
    if (!channel)
        res.status(404).json({ error: 'Channel not found' });
    res.status(201).json(channel);
});

export default router;