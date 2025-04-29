import * as express from 'express';
import User from '../models/user';

const users: express.Router = express.Router();

users.get('/', async (request: express.Request, response: express.Response) => {
    try{
        const usersInfo = await User.find();
        response.status(200).json(usersInfo); 
    } catch (error) {
        response.status(500).json({ error: 'Error fetching users' });
    }
});

export default users;