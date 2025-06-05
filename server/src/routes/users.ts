import * as express from 'express';
import {User} from '../models/user';
import { Channel } from '../models/channel';

const users: express.Router = express.Router();

users.get('/', async (request: express.Request, response: express.Response) => {
    try{
        const usersInfo = await User.find();
        response.status(200).json(usersInfo); 
    } catch (error) {
        response.status(500).json({ error: 'Error fetching users' });
    }
});

//get users from a channel
users.get('/:channelId', async (req, res) => {
  const { channelId } = req.params;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404).json({ message: 'Channel not found' });
    }

    // Get full user data based on IDs in user_list
    const users = await User.find({ _id: { $in: channel?.user_list } }).select('name username email profile_pic');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users in channel:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default users;
