import { Conversation as IConversation } from '@healwrap/campus-ai-qa-system-common';
import { Message } from './message.entity';
import { User } from '../../user/entities/user.entity';

export class Conversation implements IConversation {
  id: number;
  title: string;
  userId: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}
