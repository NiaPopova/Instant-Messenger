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
                    {channels.filter(ch => ch.user_list.length > 2).map((ch) => (
                        <li
                            key={ch._id}
                            className={currentChannel === ch._id ? 'active' : ''}
                            onClick={() => {
                                onSelectChannel(ch._id);
                            }}
                        >
                            {ch.name}
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
                        .filter((u) => u.username !== currentUser.username)
                        .map((user, i) => (
                            <li
                                key={i}
                                className={selectedUser === user.username ? 'active' : ''}
                                onClick={() => {
                                    onSelectUser(user);
                                }}
                            >
                                {user.name}
                            </li>
                        ))}
                </ul>
                <div style={{ marginTop: 'auto', color: '#aaa', fontSize: '12px' }}>
                    Влязъл: <strong>{currentUser.name}</strong>
                </div>
            </div>
        </div>
    );
}
