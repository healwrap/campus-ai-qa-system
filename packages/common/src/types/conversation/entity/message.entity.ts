import { Conversation } from './conversation.entity'

export class Message {
  id: number
  conversationId: number
  content: string
  role: string // 'user' 或 'assistant'
  createdAt: Date
}
