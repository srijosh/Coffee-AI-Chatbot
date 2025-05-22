import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { MessageInterface } from '../types/types';

interface MessageListProps {
  messages: MessageInterface[];
  isTyping: boolean;
  onClearChat: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, onClearChat }) => {
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  return (
    <div className="overflow-y-auto p-4 pt-10 relative" style={{ height: '60vh' }}>
      <div className="mb-4">
        <button
          onClick={onClearChat}
          className="absolute top-2 right-4 bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600 z-10 cursor-pointer"
        >
          Clear Chat
        </button>
      </div>
      {messages.map((message, index) => (
        <div
          key={index}
          ref={index === messages.length - 1 ? latestMessageRef : null}
        >
          <MessageItem message={message} />
        </div>
      ))}
      {isTyping && (
        <div className="max-w-[80%] ml-3 mb-3" ref={latestMessageRef}>
          <div className="flex justify-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;