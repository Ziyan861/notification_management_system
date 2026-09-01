import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(user: UserDocument) {
    const payload = { sub: user._id.toString(), username: user.username };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
      },
    };
  }
}