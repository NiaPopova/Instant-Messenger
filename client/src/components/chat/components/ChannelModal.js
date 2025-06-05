// src/components/ChannelModal.js
import React from 'react';
import { getInitials } from '../../../utils/getInitials';

export default function ChannelModal({ isOpen, channelLabel, users, allUsers, onClose }) {
    if (!isOpen) return null;
    
    const channelUsers = allUsers.filter(user => users?.includes(user._id))
    console.log(channelUsers);
    
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-channel-name"># {channelLabel}</h3>
                    <button className="modal-edit-btn">✏️ Редактирай</button>
                </div>
                <ul className="user-list">
                    {channelUsers.map((u, idx) => (
                        <li key={idx}>
                            <div className="avatar">
                                {getInitials(u.name)}
                            </div>
                            <div>
                                <div>
                                    <strong>
                                        {u.name}
                                    </strong>
                                </div>
                                <div style={{ fontSize: '12px', color: 'gray' }}>
                                    @{u.username}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="close-modal" onClick={onClose}>
                    Затвори
                </button>
            </div>
        </div>
    );
}
