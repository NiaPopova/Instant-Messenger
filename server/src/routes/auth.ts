import * as express from 'express';
import User from '../models/user';
import mongoose from 'mongoose';

const router: express.Router = express.Router();

router.post('/login', async (request: express.Request, response: express.Response) => {
  const { username, password } = request.body;

  if (!username || !password)
  {
    response.status(400).json({ message: 'Username and password required' });
    return;
  }

  const user = await User.findOne({ username, password });
  if (!user) {
    response.status(401).json({ message: 'Invalid username or password' });
   return;
  }

  response.status(200).json({ user: { username: user.username } });
});

export default router;