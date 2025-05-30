import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateConversationDto,
  UpdateConversationDto,
  CreateMessageDto,
  Conversation,
  Message,
} from '@healwrap/campus-ai-qa-system-common';
import { Observable } from 'rxjs';

// 接口定义
interface ChatMessage {
  role: string;
  content: string;
}

@Injectable()
export class ConversationService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly modelId: string;
  private readonly logger = new Logger(ConversationService.name);

  constructor(private prisma: PrismaService) {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.apiUrl = process.env.OPENROUTER_API_URL || '';
    this.modelId = process.env.OPENROUTER_MODEL_ID || '';
  }

  // ---------- 会话管理接口 ----------

  /**
   * 创建新会话
   */
  async create(userId: number, createConversationDto: CreateConversationDto) {
    // 创建会话
    const conversation = await this.prisma.conversation.create({
      data: {
        title: createConversationDto.title || '新对话',
        user: {
          connect: { id: userId },
        },
      },
    });

    // 如果有初始消息，创建第一条消息
    if (createConversationDto.initialMessage) {
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: createConversationDto.initialMessage,
          role: 'user',
        },
      });

      // 调用AI服务生成回复
      const aiResponse = await this.generateAIResponse([
        { role: 'user', content: createConversationDto.initialMessage },
      ]);

      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: aiResponse,
          role: 'assistant',
        },
      });
    }

    return this.findOne(userId, conversation.id);
  }

  /**
   * 获取所有会话
   */
  async findAll(userId: number) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    });
  }

  /**
   * 获取单个会话
   */
  async findOne(userId: number, id: number): Promise<Conversation> {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException(`会话ID为${id}的对话不存在`);
    }

    return conversation as Conversation;
  }

  /**
   * 更新会话
   */
  async update(
    userId: number,
    id: number,
    updateConversationDto: UpdateConversationDto,
  ) {
    await this.findOne(userId, id);
    return this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
    });
  }

  /**
   * 删除会话
   */
  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  /**
   * 添加消息
   */
  async addMessage(userId: number, createMessageDto: CreateMessageDto) {
    let conversation: Conversation;
    let messages: ChatMessage[] = [];

    if (createMessageDto?.conversationId) {
      conversation = await this.findOne(
        userId,
        createMessageDto?.conversationId,
      );
      // 查询出对话下的所有消息
      messages = (conversation.messages as Message[]).map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      }));
    } else {
      // 提取标题可以改造成使用更快速的小模型来完成
      const title = this.extractTitleFromMessage(createMessageDto.content);
      const newConversation = await this.prisma.conversation.create({
        data: {
          title,
          user: {
            connect: { id: userId },
          },
        },
      });
      conversation = newConversation as unknown as Conversation;
    }

    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        content: createMessageDto.content,
        role: 'user',
      },
    });

    messages.push({
      role: 'user',
      content: createMessageDto.content,
    });

    return {
      conversationId: conversation.id,
      userMessage,
      getStreamResponse: () =>
        this.generateAIResponseStream(
          messages,
          conversation.id,
          createMessageDto?.hasThoughts,
        ),
    };
  }

  // ---------- 工具方法 ----------

  /**
   * 从消息中提取标题
   */
  private extractTitleFromMessage(message: string): string {
    const titleMaxLength = 20;
    if (message.length <= titleMaxLength) {
      return message;
    }
    return message.substring(0, titleMaxLength) + '...';
  }

  /**
   * 保存AI回复到数据库
   */
  private async saveAIResponse(conversationId: number, content: string) {
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId,
        content,
        role: 'assistant',
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return assistantMessage;
  }

  // ---------- AI 请求处理 ----------

  /**
   * 发送请求到AI服务
   */
  private async callAIService(
    messages: ChatMessage[],
    streamMode = false,
    hasThoughts = false,
  ) {
    const reqBody = JSON.stringify({
      model: this.modelId,
      messages: messages,
      stream: streamMode,
      has_thoughts: hasThoughts,
    });
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: reqBody,
    });
    if (!response.ok) {
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }

    return response;
  }

  /**
   * 生成AI响应 (非流式)
   */
  private async generateAIResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await this.callAIService(messages);
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('调用AI服务失败: ' + error.message);
      return `抱歉，AI服务暂时不可用。错误信息: ${error.message}`;
    }
  }

  /**
   * 生成AI响应流
   */
  private generateAIResponseStream(
    messages: ChatMessage[],
    conversationId: number,
    hasThoughts = false,
  ): Observable<string> {
    return new Observable<string>((subscriber) => {
      let fullResponse = '';

      (async () => {
        try {
          const response = await this.callAIService(
            messages,
            true,
            hasThoughts,
          );
          const reader = response.body?.getReader();

          if (!reader) {
            throw new Error('无法获取响应流');
          }

          const decoder = new TextDecoder();

          // 处理流式响应
          let thinking = '';
          let content = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk
              .split('\n')
              .filter((line) => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (
                    parsed.choices &&
                    (parsed.choices[0].delta.content ||
                      parsed.choices[0].delta.reasoning)
                  ) {
                    // 如果是思考过程
                    if (parsed.choices[0].delta.reasoning) {
                      thinking += parsed.choices[0].delta.reasoning;
                    } else {
                      content += parsed.choices[0].delta.content;
                    }
                    // 使用对象而不是字符串拼接来创建JSON
                    fullResponse = JSON.stringify({
                      content: content,
                      thinking: thinking,
                    });
                    subscriber.next(parsed);
                  }
                } catch (e) {
                  this.logger.error('解析流数据失败: ' + e);
                }
              }
            }
          }

          // 完成后保存完整响应
          await this.saveAIResponse(conversationId, fullResponse);
          subscriber.complete();
        } catch (error) {
          this.logger.error('调用AI服务失败: ' + error.message);
          const errorMessage = `抱歉，AI服务暂时不可用。错误信息: ${error.message}`;
          // 使用JSON.stringify而不是手动拼接JSON字符串
          fullResponse = JSON.stringify({
            content: errorMessage,
            thinking: errorMessage,
          });
          subscriber.next(errorMessage);

          await this.saveAIResponse(conversationId, fullResponse);
          subscriber.complete();
        }
      })();
    });
  }
}
