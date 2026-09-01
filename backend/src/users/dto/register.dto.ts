import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\S+$/, { message: 'username must not contain spaces' })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}