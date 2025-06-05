import express from 'express';
import {Channel} from '../models/channel';
import {User} from '../models/user';

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

// Get channel by id
router.get('/:id', async (req, res) => {
    const channel = await Channel.findById(req.params.id);
    if (!channel) 
        res.status(404).json({ error: 'Channel not found' });
    res.status(201).json(channel);
});

export default router;