export class CreateUserDto {
  email: string;
  username: string;
  password: string;
  realName?: string;
  gender?: string;
  age?: number;
  highSchool?: string;
}
