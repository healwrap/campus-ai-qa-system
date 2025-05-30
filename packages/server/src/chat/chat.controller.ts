import { Controller, UseGuards, Request, Sse, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from '@healwrap/campus-ai-qa-system-common';

// SSE消息格式接口
interface MessageEvent {
  data: string;
}

@Controller({
  path: 'chat',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * 流式对话API
   * 通过SSE方式返回AI回复的流式数据
   */
  @Sse('stream')
  async chatStream(
    @Request() req,
    @Query('message') message: string,
    @Query('conversation_id') conversationId?: string,
    @Query('has_thoughts') hasThoughts?: boolean,
  ): Promise<Observable<MessageEvent>> {
    const createMessageDto: CreateMessageDto = {
      content: message,
      conversationId: conversationId ? parseInt(conversationId) : undefined,
      hasThoughts: hasThoughts ?? false,
    };

    return (
      await this.conversationService.addMessage(req.user.id, createMessageDto)
    )
      .getStreamResponse()
      .pipe(
        map((chunk) => ({
          data: JSON.stringify(chunk),
        })),
      );
  }
}
