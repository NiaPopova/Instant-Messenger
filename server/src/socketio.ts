import { Socket, Server} from 'socket.io';
import {Message} from '../src/models/mesage';
import messages from './routes/messages';
import Channel from './models/channel';

const onlineUsersList = new Map();

export const socketSetUp = (io: Server) => {

    io.on('connection', (socket: Socket) => {
        //console.log('User connected');

        //socket.on('log', (user: string) => {
            const userId = socket.handshake.query.userId;

            if (userId) {
                onlineUsersList.set(userId, socket.id);
                console.log(`${userId} logged in the application`);
            } else {
                console.log('User ID not provided!');
            }
        //});

        socket.on('message', async (message) => {
            const senderId = onlineUsersList.get(message.sender);
            const receiverId = onlineUsersList.get(message.recipient);
            
            const newMessage = await Message.create(message);

            const messageData = await Message.findById(newMessage.id)
                        .populate('sender', "id email name profile_pic")
                        .populate('recipient', "id email name profile_pic");

            if (receiverId) {
                io.to(receiverId).emit('receive-message', messageData);
            }

            if (senderId) {
                io.to(senderId).emit('receive-message', messageData);
            }


        //    await message.save();

        //     socket.emit('sent_message', { receiver, content, timestamp: message.timestamp });

        //     //send in real time 
        //     const receiverSocket = onlineUsersList.get(receiver);
        //     if (receiverSocket) {
        //         io.to(receiverSocket).emit('message', { sender, content, timestamp: message.timestamp});
        //     }
         });

        socket.on('send-channel-message', async (message) => {
            const  {channelId, sender, content} = message;

            const createdMessage = await Message.create({
                sender,
                recipient: null,
                content,
                timestamp: new Date()
            });
            
            const messageData = await Message.findById(createdMessage._id)
                .populate('sender', 'id email name profile_pic')
                .exec();

            await Channel.findByIdAndUpdate(channelId, {
                $push: {messages: createdMessage._id}
            });

            const channel = await Channel.findById(channelId).populate('members');

            const final = {...messageData, channelId: channel?.id};

            if (channel && channel.members) {
                channel.members.forEach(m => {
                    const memberSocket = onlineUsersList.get(m.id.toString());
                    if (memberSocket) {
                        io.to(memberSocket).emit('receive-channel-message', final);
                    }

                    const adminSocket = onlineUsersList.get(channel.admin.id.toString());
                    if (adminSocket) {
                        io.to(adminSocket).emit('receive-channel-message', final);
                    }
                });
            }

        });

        socket.on('disconnect', () => {
            onlineUsersList.forEach((userId, socketID) => {
                if (socketID === socket.id) {
                    onlineUsersList.delete(userId);
                    console.log(`${userId} disconnected from the application`);
                }
            })
        });
    })
}