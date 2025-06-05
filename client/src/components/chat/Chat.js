// src/Chat.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChannelModal from "./components/ChannelModal";
//import PrivateChatWindow from "./components/PrivateChatWindow";
import socket from '../../socket';


function Chat() {
    const navigate = useNavigate();

    // -----------------------------
    // 1) ИЗВЛИЧАМЕ currentUser от localStorage
    // -----------------------------
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const [currentUser, setCurrentUser] = useState(parsedUser || null);

    // Ако няма валиден user, прехвърляме към /login
    useEffect(() => {
        if (!parsedUser || !parsedUser.username) {
            navigate("/login", { replace: true });
        }
    }, [parsedUser, navigate]);

    // -----------------------------
    // 2) PUBLIC CHANNEL-RELATED STATE
    // -----------------------------
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState("");
    const [channelMessages, setChannelMessages] = useState([]);
    const [channelUsers, setChannelUsers] = useState([]);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

    // -----------------------------
    // 3) PRIVATE CHAT-RELATED STATE
    // -----------------------------
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});

    // =====================================================
    // 5) След като компонентът “Chat” се монтира, и ако имаме currentUser:
    //    – инициализираме Socket.IO
    //    – зареждаме канали и всички потребители
    // =====================================================
    useEffect(() => {
        if (!currentUser) return;

        // Инициализираме socket
        socket.connect();
        socket.emit('log', currentUser);

        // Зареждаме списъка с канали и всички потребители
        loadChannels();
        loadAllUsers(); // usage for the creation of channel - maybe?

        socket.on('receive-message', (newMessage) => {
            setChannelMessages((prev) => [...prev, newMessage]);
        })

        // Когато анализът се демунтира, затваряме socket връзката
        return () => {
            socket.disconnect();
        };
    }, [currentUser]);

    // =====================================
    // 6) Зареждане на списъка с канали от бекенда
    // =====================================
    const loadChannels = async () => {
        try {
            const res = await fetch("http://localhost:4002/api/channels");
            const channelsArr = await res.json(); // [{ id, label }, ...]
            const publicChannels = channelsArr.filter(ch => ch.user_list.length > 2);

            setChannels(publicChannels);

            // Ако няма избран канал, избираме първия
            if (!currentChannel && channelsArr.length > 0) {
                setCurrentChannel(channelsArr[0]._id);
            }
        } catch (err) {
            console.error("Грешка при loadChannels:", err);
        }
    };

    // =====================================
    // 7) Зареждане на всички потребители от бекенда
    // =====================================
    const loadAllUsers = async () => {
        try {
            const fetchedUsers = await fetch("http://localhost:4002/api/users");
            const usersArr = await fetchedUsers.json(); // [{ username }, ...]
            const onlyUsernames = usersArr.map((u) => ({ username: u.username, name: u.name, _id: u._id }));
            setUsers(onlyUsernames);
        } catch (err) {
            console.error("Грешка при loadAllUsers:", err);
        }
    };

    // ======================================================
    // 8) Всяка промяна на currentChannel → зареждаме съобщения и потребители за този канал
    // ======================================================
    useEffect(() => {
        const fetchChannelData = async () => {
            if (!currentChannel) {
                setChannelMessages([]);
                setChannelUsers([]);
                return;
            }

            try {
                socket.emit('join-channel', { channelId: currentChannel });
                // 1) GET съобщения
                const resMsgs = await fetch(
                    `http://localhost:4002/api/messages/${currentChannel}`
                );
                const msgs = await resMsgs.json();
                setChannelMessages(msgs);

                // 2) GET участници в канала
                const resUsers = await fetch(
                    `http://localhost:4002/api/users/${currentChannel}`
                );
                const channelUsersArr = await resUsers.json(); // [{ firstName, lastName, username }, ...]
                setChannelUsers(channelUsersArr);
            } catch (err) {
                console.error("Грешка при fetchChannelData:", err);
            }
        };

        fetchChannelData();
    }, [currentChannel]);

    // ======================================================
    // 10) Изпращане на ново public съобщение
    // ======================================================
    const handleSendPublicMessage = (text) => {
        if (!text || !currentChannel) return;

        const message = {
            sender_id: currentUser, // or the ID if it does not work
            chat_id: currentChannel,
            content: text,
            timestamp: new Date()
        };

        socket.emit('send-message', {
            channelId: currentChannel,
            message
        });
    };

    // ======================================================
    // 12) Функции за смяна на канал/потребител
    // ======================================================
    const handleSelectChannel = (channelId) => {
        setCurrentChannel(channelId);
        // setSelectedUser("");
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);

        try {
            const res = await fetch(
                `http://localhost:4002/api/channels/private-channel/${currentUser._id}/${user._id}`, { method: 'POST' }
            );

            const channel = await res.json();
            setCurrentChannel(channel._id);
        } catch (err) {
            console.error("Грешка при fetchPrivateMessages:", err);
        }
    };

    // ======================================================
    // 13) Ако няма currentUser (например localStorage е изчистен), navigate към /login
    //     – всяка промяна на currentUser се хваща по-горе в useEffect
    // ======================================================
    if (!currentUser) {
        return null; // Редиректът вече е извършен в useEffect
    }

    // ======================================================
    // 14) Ако имаме currentUser, показваме чат интерфейса
    // ======================================================
    return (
        <div className="chat-page app" style={{ display: "flex" }}>
            {/* Sidebar: канали + потребители */}
            <Sidebar
                channels={channels}
                currentChannel={currentChannel}
                onSelectChannel={handleSelectChannel}
                users={users}
                currentUser={currentUser}
                selectedUser={selectedUser}
                onSelectUser={handleSelectUser}
            />

            {/* Main area */}
            <div style={{ flex: 1, position: "relative" }}>
                {currentChannel ? (
                    <>
                        <ChatWindow
                            channelId={currentChannel}
                            channelLabel={
                                channels.find((ch) => ch._id === currentChannel)?.name || ""
                            }
                            messages={channelMessages}
                            onSendMessage={handleSendPublicMessage}
                            onOpenSettings={() => setIsChannelModalOpen(true)}
                            users={users}
                        />
                        <ChannelModal
                            isOpen={isChannelModalOpen}
                            channelLabel={
                                channels.find((ch) => ch._id === currentChannel)?.name || ""
                            }
                            users={channels.find((ch) => ch._id === currentChannel)?.user_list}
                            allUsers={users}
                            onClose={() => setIsChannelModalOpen(false)}
                        />
                    </>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#888",
                            fontSize: "18px",
                        }}
                    >
                        Изберете канал или потребител отляво, за да започнете.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
