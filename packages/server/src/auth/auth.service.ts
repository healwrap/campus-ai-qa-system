import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@healwrap/campus-ai-qa-system-common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 验证用户凭据
   * 检查邮箱和密码是否匹配数据库中的用户
   */
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * 验证管理员凭据
   * 检查邮箱和密码是否匹配数据库中的管理员
   */
  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  /**
   * 用户登录
   * 验证用户凭据并生成JWT令牌
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: 'user' };

    // 使用any类型避免TypeScript的类型检查错误
    const userAny = user as any;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userAny.id,
        email: userAny.email,
        username: userAny.username,
        realName: userAny.realName,
        gender: userAny.gender,
        age: userAny.age,
        highSchool: userAny.highSchool,
      },
    };
  }

  /**
   * 管理员登录
   * 验证管理员凭据并生成JWT令牌
   */
  async adminLogin(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: admin.id, email: admin.email };
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    };
  }

  /**
   * 用户注册
   * 创建新用户账号并生成JWT令牌
   */
  async register(userDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // 暂时使用any类型绕过TypeScript的类型检查
    const userData: any = {
      email: userDto.email,
      username: userDto.username,
      password: hashedPassword,
    };

    if (userDto.realName) userData.realName = userDto.realName;
    if (userDto.gender) userData.gender = userDto.gender;
    if (userDto.age) userData.age = userDto.age;
    if (userDto.highSchool) userData.highSchool = userDto.highSchool;

    // Create new user with all fields
    const user = await this.prisma.user.create({
      data: userData,
    });

    // Generate JWT
    const payload = { sub: user.id, email: user.email, role: 'user' };

    // 使用any类型避免TypeScript的类型检查错误
    const userAny = user as any;

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userAny.id,
        email: userAny.email,
        username: userAny.username,
        realName: userAny.realName,
        gender: userAny.gender,
        age: userAny.age,
        highSchool: userAny.highSchool,
      },
    };
  }

  /**
   * 管理员注册
   * 创建新管理员账号并生成JWT令牌
   */
  async registerAdmin(email: string, username: string, password: string) {
    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await this.prisma.admin.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // Generate JWT
    const payload = { sub: admin.id, email: admin.email };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
      },
    };
  }
}
