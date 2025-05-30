import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '@healwrap/campus-ai-qa-system-common';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   * 创建新用户账号并返回访问令牌
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录
   * 验证用户凭据并返回访问令牌
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  /**
   * 管理员注册
   * 创建新管理员账号并返回访问令牌
   */
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(
      registerDto.email,
      registerDto.username,
      registerDto.password,
    );
  }

  /**
   * 管理员登录
   * 验证管理员凭据并返回访问令牌
   */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto.email, loginDto.password);
  }
}
