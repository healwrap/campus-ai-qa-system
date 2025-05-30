import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
  Conversation,
} from '@healwrap/campus-ai-qa-system-common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

// Interface for return types
interface BaseConversation {
  id: number;
  title: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Controller({
  path: 'conversations',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * 创建新会话
   */
  @Post()
  create(
    @Request() req,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<Conversation> {
    return this.conversationService.create(req.user.id, createConversationDto);
  }

  /**
   * 获取所有会话
   */
  @Get()
  findAll(@Request() req): Promise<Conversation[]> {
    return this.conversationService.findAll(req.user.id);
  }

  /**
   * 获取单个会话
   */
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Conversation> {
    return this.conversationService.findOne(req.user.id, id);
  }

  /**
   * 更新会话
   */
  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConversationDto: UpdateConversationDto,
  ): Promise<BaseConversation> {
    return this.conversationService.update(
      req.user.id,
      id,
      updateConversationDto,
    );
  }

  /**
   * 删除会话
   */
  @Delete(':id')
  remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseConversation> {
    return this.conversationService.remove(req.user.id, id);
  }
}
