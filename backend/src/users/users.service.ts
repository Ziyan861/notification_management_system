import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(dto: RegisterDto): Promise<UserDocument> {
    const existing = await this.userModel.findOne({
      username: dto.username.toLowerCase(),
    });

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    return this.userModel.create({
      fullName: dto.fullName,
      username: dto.username,
      password: hashed,
    });
  }

  async findByUsernameWithPassword(
    username: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ username: username.toLowerCase() })
      .select('+password');
  }

  async validateCredentials(dto: LoginDto): Promise<UserDocument> {
    const user = await this.findByUsernameWithPassword(dto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}