import * as express from 'express';
import Message from '../models/message';

const messages: express.Router = express.Router();

messages.get('/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
    const { firstUser, secondUser } = request.params;

    const chatMessages = await Message.find({
        $or: [
            { sender: firstUser, receiver: secondUser },
            { sender: secondUser, receiver: firstUser }
        ]
    }).sort({ timestamp: 1});
    response.status(200).json(chatMessages);
});

export default messages;