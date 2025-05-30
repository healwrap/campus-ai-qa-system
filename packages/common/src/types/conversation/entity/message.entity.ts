import type { Conversation } from "./conversation.entity";

export interface Message {
	id: number;
	conversationId: number;
	conversation?: Conversation;
	content: string;
	role: string; // 'user' 或 'assistant'
	createdAt: Date;
}
