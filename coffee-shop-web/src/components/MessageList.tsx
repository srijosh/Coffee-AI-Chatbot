import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { MessageInterface } from '../types/types';

interface MessageListProps {
  messages: MessageInterface[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {isTyping && (
        <div className="max-w-[80%] ml-3 mb-3">
          <div className="flex justify-start p-3 px-4 rounded-2xl bg-indigo-100 border border-indigo-200">
            <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;