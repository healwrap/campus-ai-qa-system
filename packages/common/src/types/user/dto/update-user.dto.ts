import {
  IsOptional,
  IsString,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
{
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(20, { message: '用户名长度不能超过20个字符' })
  @IsOptional()
  username?: string;

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
