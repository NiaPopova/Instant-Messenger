// src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from 'react';
import { getInitials } from '../../../utils/getInitials';
//import { socket } from '../../../socket';

export default function ChatWindow({
    channelLabel,
    messages,
    onSendMessage,
    onOpenSettings,
    users,
    onSearch
}) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const [searchString, setSearchString] = useState('');

    // Скролиране надолу при всяка промяна на messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSendMessage(inputValue.trim());
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    useEffect(() => {
        // Don’t call onSearch immediately; wait `delay` ms after the last keystroke.
        const handler = setTimeout(() => {
            onSearch(searchString);
            console.log(searchString);
            
        }, 500);

        // If `searchText` changes again before `delay` has passed, clear the previous timer.
        return () => {
            clearTimeout(handler);
        };
    }, [searchString]);

    return (
        <div className="chat">
            <header className="chat-header">
                <div className="chat-header-content" style={{ width: '100%' }}>
                    <h2 className="channel-title">{channelLabel}</h2>
                    <button className="settings-btn" onClick={onOpenSettings}>
                        ⚙️ Настройки
                    </button>
                    <input type='text' placeholder='Търси в чата...' value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}></input>
                </div>
            </header>

            <section className="chat-messages">
                {messages.map((msg, idx) => {
                    const msgUser = users.find(u => u._id === msg.sender_id)

                    return (
                        <div className="message" key={idx}>
                            <div className="avatar">
                                {getInitials(msgUser.name)}
                            </div>
                            <div className="content">
                                <div className="name">
                                    {msgUser.name}{' '}
                                    <span className="username">(@{msgUser.username})</span>
                                </div>
                                <div className="text">{msg.content}</div>
                                <div className="time">🕒 {msg.timestamp}</div>
                            </div>
                        </div>
                    )
                })}

                <div ref={messagesEndRef} />
            </section>

            <div className="chat-input">
                <input
                    type="text"
                    className="message-input"
                    placeholder="Напиши съобщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="send-button" onClick={handleSend}>
                    Изпрати
                </button>
            </div>
        </div>
    );
}
