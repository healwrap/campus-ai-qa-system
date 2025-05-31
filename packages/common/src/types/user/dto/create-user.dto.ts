import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '请提供有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(20, { message: '用户名长度不能超过20个字符' })
  username: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  password: string;

  @IsString({ message: '真实姓名必须是字符串' })
  @IsOptional()
  realName?: string;

  @IsString({ message: '性别必须是字符串' })
  @IsOptional()
  gender?: string;

  @IsInt({ message: '年龄必须是整数' })
  @Min(14, { message: '年龄不能小于14岁' })
  @Max(100, { message: '年龄不能大于100岁' })
  @IsOptional()
  age?: number;

  @IsString({ message: '高中学校必须是字符串' })
  @IsOptional()
  highSchool?: string;
}
