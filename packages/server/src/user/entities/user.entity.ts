import { User as IUser } from '@healwrap/campus-ai-qa-system-common';

export class User implements IUser {
  id: number;
  email: string;
  username: string;
  password: string;
  realName?: string;
  gender?: string;
  age?: number;
  highSchool?: string;
  createdAt: Date;
  updatedAt: Date;
}
