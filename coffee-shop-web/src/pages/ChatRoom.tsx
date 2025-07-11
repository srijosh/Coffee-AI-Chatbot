import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import MessageList from '../components/MessageList';
import PageHeader from '../components/PageHeader';
import { callChatBotAPI } from '../services/chatBot';
import { useCart } from '../components/CartContext';
import { MessageInterface } from '../types/types';

// import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ChatRoom: React.FC = () => {
  const { addToCart, emptyCart } = useCart();
  const [messages, setMessages] = useState<MessageInterface[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { token, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
    }
    if (isAuthLoading) {
      return; // Wait for auth state to be ready
    }
  }, [messages, token, navigate, location]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: MessageInterface = {
      role: 'user',
      content: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    if (inputRef.current) inputRef.current.value = '';
    setIsTyping(true);

    try {
      const responseMessage = await callChatBotAPI([...messages, userMessage]);
      // const responseMessage = { role: 'assistant', content: 'This is a mock response from the bot. ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', memory: { order: [] } }; // Mock response for testing
      setMessages((prev) => [...prev, { ...responseMessage, role: 'assistant' }]);
      setIsTyping(false);

      if (responseMessage.memory && responseMessage.memory.order) {
        emptyCart();
        responseMessage.memory.order.forEach((item: { item: string; quantity: number }) => {
          addToCart(item.item, item.quantity);
        });
      }
    } catch (error) {
      console.error('Failed to get bot response:', error);
      alert(`${error}`);
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col">
        <PageHeader title="Chat Bot" bgColor="bg-gray-100" />
        <div className="flex flex-col flex-1">
          <MessageList messages={messages} isTyping={isTyping} onClearChat={handleClearChat} />
          <div className="pt-2 pb-6 mx-3">
            <div className="flex justify-between items-center border border-neutral-300 bg-white rounded-full pl-5 pr-2 py-2">
              <input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type message..."
                className="flex-1 text-base outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-neutral-200 p-2 rounded-full cursor-pointer hover:bg-neutral-300"
              >
                <Send size={20} color="#737373" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;