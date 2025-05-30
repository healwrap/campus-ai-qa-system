export interface CreateMessageDto {
	content: string;
	role?: string; // 'user' or 'assistant', default will be 'user' on server side
	hasThoughts?: boolean; // whether the message has thoughts, default will be false on server side
	conversationId?: number; // Optional conversation id to continue the conversation
}
