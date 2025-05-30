import { Message as IMessage } from '@healwrap/campus-ai-qa-system-common';
import { Conversation } from './conversation.entity';

export class Message implements IMessage {
  id: number;
  conversationId: number;
  conversation: Conversation;
  content: string;
  role: string; // 'user' 或 'assistant'
  createdAt: Date;
}
