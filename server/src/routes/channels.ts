import express from 'express';
import { Channel } from '../models/channel';
import {getAllChannels, createNewChannel, createNewPrivateChannel, getChannelById} from '../controllers/channelsController'

const channelsRouter = express.Router();

channelsRouter.get('/', getAllChannels);
channelsRouter.post('/', createNewChannel);
channelsRouter.post('/private-channel/:firstUser/:secondUser', createNewPrivateChannel);
channelsRouter.get('/:id', getChannelById);

export default channelsRouter;