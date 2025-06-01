// src/components/ChatWindow.js
import { useState, useRef, useEffect } from 'react';
import { getInitials } from '../../../utils/getInitials';

export default function ChatWindow({
    channelLabel,
    messages,
    onSendMessage,
    onOpenSettings,
}) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Скролиране надолу при ново съобщение
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

    return (
        <div className="chat">
            <header className="chat-header">
                <div className="chat-header-content">
                    <h2 className="channel-title">{channelLabel}</h2>
                    <button className="settings-btn" onClick={onOpenSettings}>
                        ⚙️ Настройки
                    </button>
                </div>
            </header>

            <section className="chat-messages">
                {messages.map((msg, idx) => (
                    <div className="message" key={idx}>
                        <div className="avatar">
                            {getInitials(msg.firstName, msg.lastName)}
                        </div>
                        <div className="content">
                            <div className="name">
                                {msg.firstName} {msg.lastName}{' '}
                                <span className="username">(@{msg.username})</span>
                            </div>
                            <div className="text">{msg.text}</div>
                            <div className="time">🕒 {msg.timeAgo}</div>
                        </div>
                    </div>
                ))}
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
