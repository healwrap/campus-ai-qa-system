import { IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { CreateConversationDto } from './create-conversation.dto'

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  @IsString({ message: '标题必须是字符串' })
  @IsOptional()
  title?: string
}
