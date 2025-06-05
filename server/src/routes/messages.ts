import * as express from 'express';
import {Message} from '../models/mesage';

const messages: express.Router = express.Router();

// messages.get('/:firstUser/:secondUser', async (request: express.Request, response: express.Response) => {
//     const { firstUser, secondUser } = request.params;

//     const chatMessages = await Message.find({
//         $or: [
//             { sender: firstUser, receiver: secondUser },
//             { sender: secondUser, receiver: firstUser }
//         ]
//     }).sort({ timestamp: 1});
//     response.status(200).json(chatMessages);
// });


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
// messages.get('/search', async (req, res) => {
//   const query = req.query.query?.toLowerCase() || '';
//   const channel = req.query.channel || 'all';

// //   const filePath = path.join(__dirname, 'messages.json');
// //   const rawData = fs.readFileSync(filePath);
// //   const messages = JSON.parse(rawData);

//   const filtered = await messages.filter(msg => {
//     const matchesQuery = query === '' || msg.message.toLowerCase().includes(query);
//     const matchesChannel = channel === 'all' || msg.channelId === channel;
//     return matchesQuery && matchesChannel;
//   });

//   res.status(200).json(filtered);
// });

export default messages;