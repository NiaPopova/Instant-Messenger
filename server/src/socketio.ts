import { Socket, Server} from 'socket.io';
import {Message} from '../src/models/mesage';
import { Channel } from './models/channel';

const onlineUsersList = new Map<string, string>();

export const socketSetUp = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log('User connected');

        socket.on('log', (user: string) => {
            onlineUsersList.set(user, socket.id);
            console.log(`${user} logged in the application`);
        });

        socket.on('join-channel', ({ channelId }) => {
            socket.join(channelId);
            console.log(`Socket ${socket.id} joined channel ${channelId}`);
        });


        socket.on('send-message', async ({ channelId, message }) => {
            try {
                const savedMessage = new Message(message);
                await savedMessage.save();

                await Channel.findByIdAndUpdate(channelId, {
                    $push: { message_list: savedMessage._id }
                });

                io.to(channelId).emit('receive-message', savedMessage);

            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // socket.on('message', async ({ sender, receiver, content}) => {
        //     const message = new Message( { sender, receiver, content, timestamp: new Date() });
        //     await message.save();

        //     socket.emit('sent_message', { receiver, content, timestamp: message.timestamp });

        //     //send in real time 
        //     const receiverSocket = onlineUsersList.get(receiver);
        //     if (receiverSocket) {
        //         io.to(receiverSocket).emit('message', { sender, content, timestamp: message.timestamp});
        //     }
        // });

        socket.on('disconnect', () => {
            onlineUsersList.forEach((socketID, user) => {
                if (socketID === socket.id) {
                    onlineUsersList.delete(user);
                    console.log(`${user} disconnected from the application`);
                }
            })
        });
    })
}