import { Socket, Server} from 'socket.io';
import Message from './models/message';

const onlineUsers = new Map<string, string>();

export const socketSetUp = (io: Server) => {
    io.on('connection', (socket: Socket) => {

        socket.on('register', (userID: string) => {
            onlineUsers.set(userID, socket.id);
            console.log(`Registered ${userID}`);
        });

        socket.on('message', async ({ sender, receiver, content}) => {
            const message = new Message( { sender, receiver, content, timestamp: new Date() });
            await message.save();

            socket.emit('sent_message', { receiver, content, timestamp: message.timestamp });

            //send in real time 
            const receiverSocket = onlineUsers.get(receiver);
            if (receiverSocket) {
                io.to(receiverSocket).emit('message', { sender, content, timestamp: message.timestamp});
            }
        });

        socket.on('disconnect', () => {
            onlineUsers.forEach((socketID, userID) => {
                if (socketID === socket.id) {
                    onlineUsers.delete(userID);
                    console.log(`${userID} disconnected`);
                }
            })
        });
    })
}