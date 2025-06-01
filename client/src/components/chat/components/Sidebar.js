// src/components/Sidebar.js
import React from 'react';

export default function Sidebar({
    channels,
    currentChannel,
    onSelectChannel,
    users,
    currentUser,
    selectedUser,
    onSelectUser,
}) {
    return (
        <div className="sidebar">
            {/* Първа секция: Public channels */}
            <div style={{ marginBottom: '20px' }}>
                <div className="logo">ChatApp</div>
                <ul className="channel-list">
                    {channels.map((ch) => (
                        <li
                            key={ch.id}
                            className={currentChannel === ch.id ? 'active' : ''}
                            onClick={() => {
                                onSelectChannel(ch.id);
                            }}
                        >
                            {ch.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Втора секция: Private users */}
            <div style={{ borderTop: '1px solid #444', paddingTop: '20px' }}>
                <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                    Потребители
                </div>
                <ul className="channel-list">
                    {users
                        .filter((u) => u !== currentUser)
                        .map((username) => (
                            <li
                                key={username}
                                className={selectedUser === username ? 'active' : ''}
                                onClick={() => {
                                    onSelectUser(username);
                                }}
                            >
                                {username}
                            </li>
                        ))}
                </ul>
                <div style={{ marginTop: 'auto', color: '#aaa', fontSize: '12px' }}>
                    Влязъл: <strong>{currentUser}</strong>
                </div>
            </div>
        </div>
    );
}
