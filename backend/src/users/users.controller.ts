import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.usersService.register(dto);
    return this.toSafeUser(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.validateCredentials(dto);
    return this.toSafeUser(user);
  }

  private toSafeUser(user: UserDocument) {
    return {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
    };
  }
}