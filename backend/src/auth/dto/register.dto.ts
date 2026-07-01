import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  email!: string;

  @ApiProperty({ example: 'password123', description: 'Minimum 8 characters' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

}
