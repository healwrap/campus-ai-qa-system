import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto  {
  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsString({ message: '角色必须是字符串' })
  @IsOptional()
  role?: string;

  @IsBoolean({ message: '是否包含思考过程必须是布尔值' })
  @IsOptional()
  hasThoughts?: boolean;

  @IsInt({ message: '对话ID必须是整数' })
  @IsOptional()
  conversationId?: number;
}
