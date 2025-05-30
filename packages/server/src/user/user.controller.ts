import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() req: { name: string }) {
    console.log(req);

    return {
      code: 200,
      message: req.name,
    };
  }
}
