import * as express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import messages from './routes/messages';
import users from './routes/users';
mongoose.connect('mongodb://localhost:27017/messages');

const app = express();

app.use('/messages', messages);
app.use('/users', users);


app.listen(4002, () => {
    console.log('Server is listening on port 4002')
});


