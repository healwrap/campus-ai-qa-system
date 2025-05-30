import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [ConversationModule],
  controllers: [ChatController],
})
export class ChatModule {}
