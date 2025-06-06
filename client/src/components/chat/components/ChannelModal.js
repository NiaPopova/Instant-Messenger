import React from 'react';
import { getInitials } from '../../../utils/getInitials';
import styles from './channel.module.scss';

export default function ChannelModal({ isOpen, channelLabel, users, onClose }) {
    if (!isOpen) return null;
    
    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h3 className={styles['modal-channel-name']}>{channelLabel}</h3>
                    <button className={styles['modal-edit-btn']}>Редактирай</button>
                </div>
                <ul className={styles['user-list']}>
                    {users.map((u, idx) => (
                        <li key={idx}>
                            <div className={styles.avatar}>
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
                <button className={styles['close-modal']} onClick={onClose}>
                    Затвори
                </button>
            </div>
        </div>
    );
}
