import React, { FC } from 'react';
import { searchMessagesWrapper } from './searchMessages.styled';

interface searchMessagesProps {}

const searchMessages: FC<searchMessagesProps> = () => (
 <searchMessagesWrapper>
    searchMessages Component
 </searchMessagesWrapper>
);

export default searchMessages;
