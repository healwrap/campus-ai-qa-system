import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateConversationDto  {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsInt({ message: '用户ID必须是整数' })
  @IsOptional()
  userId?: number;

  @IsString({ message: '初始消息必须是字符串' })
  @IsOptional()
  initialMessage?: string;
}
