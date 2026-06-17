import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateNoteDto {

  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title!: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

}
