import * as express from 'express';
import { createChannel, getChannelMessages, getUserChannels } from '../controllers/channelController';
const router = express.Router();

router.post('/new-channel', createChannel);
router.get('/user-channels', getUserChannels);
router.get('/messages', getChannelMessages);

export default router;