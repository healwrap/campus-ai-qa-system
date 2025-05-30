import { Admin as IAdmin } from '@healwrap/campus-ai-qa-system-common';

export class Admin implements IAdmin {
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
