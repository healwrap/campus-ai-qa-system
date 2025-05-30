import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { LoginDto as ILoginDto } from '@healwrap/campus-ai-qa-system-common';

export class LoginDto implements ILoginDto {
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  password: string;
}
