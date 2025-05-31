import { Message } from './message.entity'
import { User } from '../../user/entity/user.entity'

export class Conversation {
  id: number
  title: string
  userId: number
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}
