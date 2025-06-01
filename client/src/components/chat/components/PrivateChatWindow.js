// src/components/PrivateChatWindow.js
import React, { useState, useEffect, useRef } from 'react';

export default function PrivateChatWindow({
    socket,
    currentUser,
    selectedUser,
    onSendMessage,
    messages,
}) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Скролиране надолу при промяна на messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedUser]);

    const handleSend = () => {
        const content = inputValue.trim();
        if (!content || !selectedUser) return;
        onSendMessage(selectedUser, content);
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat">
            <header className="chat-header">
                <div className="chat-header-content" style={{ width: '100%' }}>
                    <h2 className="channel-title">
                        Чат с: {selectedUser || '—'}
                    </h2>
                </div>
            </header>

            <section className="chat-messages">
                {!selectedUser ? (
                    <p style={{ color: '#888' }}>Изберете потребител отляво, за да започнете чат.</p>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            className="message"
                            key={idx}
                            id={msg.sender === currentUser ? 'current' : ''}
                        >
                            <div className="sender">
                                {msg.sender === currentUser ? 'You' : msg.sender}
                            </div>
                            <div className="content">{msg.content}</div>
                        </div>
                    ))
                )}
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
                    disabled={!selectedUser}
                />
                <button className="send-button" onClick={handleSend} disabled={!selectedUser}>
                    Изпрати
                </button>
            </div>
        </div>
    );
}
