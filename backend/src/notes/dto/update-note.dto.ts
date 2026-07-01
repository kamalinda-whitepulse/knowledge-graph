import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {

  @ApiPropertyOptional({ example: 'Updated title', description: 'Note title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated content', description: 'Note content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: ['backend', 'nodejs'], description: 'Array of tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

}
