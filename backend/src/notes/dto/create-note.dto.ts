import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {

  @ApiProperty({ example: 'NestJS', description: 'Note title' })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title!: string;

  @ApiPropertyOptional({ example: 'A Node.js framework', description: 'Note content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: ['backend', 'nodejs'], description: 'Array of tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

}
