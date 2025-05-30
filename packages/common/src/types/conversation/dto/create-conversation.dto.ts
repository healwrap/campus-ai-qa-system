export interface CreateConversationDto {
	title: string;
	userId?: number; // Optional for client, will be set by server
	initialMessage?: string; // Optional initial message to start the conversation
}
