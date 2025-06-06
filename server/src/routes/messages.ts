import * as express from 'express';
import { Message } from '../models/mesage';

const messages: express.Router = express.Router();

messages.get('/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
  const { firstUser, secondUser } = request.params;

  const chatMessages = await Message.find({
    $or: [
      { sender: firstUser, receiver: secondUser },
      { sender: secondUser, receiver: firstUser }
    ]
  }).sort({ timestamp: 1 });
  response.status(200).json(chatMessages);
});


messages.get('/:channelId', async (req: express.Request, res: express.Response) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ chat_id: channelId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});



// Teodor
messages.post('/search', async (req, res) => {
  try {
    const { searchQuery, channelId } = req.body;

    // 1) Extract query params; default to empty string / "all"
    const searchTerm = (searchQuery || '').toString().trim();
    const chat = (channelId || 'all').toString();

    // 2) Build a Mongo filter object
    const filter: Record<string, any> = {};

    // If there's a non-empty searchTerm, search against `content` (case‐insensitive)
    if (searchTerm) {
      filter.content = { $regex: searchTerm, $options: 'i' };
    }

    // If "channel" (i.e. chat) is not "all", filter by that chat_id
    if (chat !== 'all') {
      filter.chat_id = chat;
    }

    // 3) Execute the query
    const filteredMessages = await Message.find(filter).exec();

    return res.status(200).json(filteredMessages);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default messages;
