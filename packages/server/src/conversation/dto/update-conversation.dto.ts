import { IsOptional, IsString } from 'class-validator';
import { UpdateConversationDto as IUpdateConversationDto } from '@healwrap/campus-ai-qa-system-common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';

export class UpdateConversationDto
  extends PartialType(CreateConversationDto)
  implements IUpdateConversationDto
{
  @IsString({ message: '标题必须是字符串' })
  @IsOptional()
  title?: string;
}
