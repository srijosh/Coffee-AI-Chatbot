import axios from 'axios';
import { MessageInterface } from '../types/types';
import { API_URL } from '../config/config';

export async function callChatBotAPI(messages: MessageInterface[]): Promise<MessageInterface> {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      input: { messages }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const outputMessage: MessageInterface = response.data.output;
    return outputMessage;
  } catch (error) {
    console.error('Error calling the API:', error);
    throw error;
  }
}