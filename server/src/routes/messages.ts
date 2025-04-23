import * as express from 'express';
import Message from '../models/message';
import { REPL_MODE_STRICT } from 'repl';

const messages = express.Router();

messages.get('/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
    const { firstUser, secondUser } = request.params;

    const chatMessages = await Message.find({
        $or: [
            { sender: firstUser, receiver: secondUser },
            { sender: secondUser, receiver: firstUser }
        ]
    }).sort({ timestamp: 'asc'});
    response.status(200).json(chatMessages);
});

messages.post('/', async (request: express.Request, response: express.Response) => {
    const { sender, receiver, content } = request.params;

    const message = new Message( { sender, receiver, content} );
    await message.save();
    response.status(200).json(message);
});

export default messages;