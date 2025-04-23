import * as express from 'express';
import User from '../models/user';

const users = express.Router();

// list
users.get('/', async (request: express.Request, response: express.Response) => {
    const usersInfo = await User.find();
    response.status(200).json(usersInfo); //validation
});

users.post('/', async (request: express.Request, response: express.Response) => {
    const { username } = request.body;

    const user = new User({username});
    await user.save();
    response.status(200).json(user); //check status code
})