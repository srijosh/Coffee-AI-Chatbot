import React from 'react';
import { MessageInterface } from '../types/types';

interface MessageItemProps {
  message: MessageInterface;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div
      className={`flex mb-3 ${message.role === 'user' ? 'justify-end mr-3' : 'justify-start ml-3'}`}
    >
      <div
        className={`max-w-[80%] p-3 px-4 rounded-2xl border ${
          message.role === 'user'
            ? 'bg-white border-neutral-200'
            : 'bg-indigo-100 border-indigo-200'
        }`}
      >
        <p className="text-sm text-gray-800">{message.content}</p>
      </div>
    </div>
  );
};

export default MessageItem;